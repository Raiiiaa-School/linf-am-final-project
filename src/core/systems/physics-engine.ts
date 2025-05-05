import { Vector2 } from "../utils/vector2";
import { Area } from "../nodes/physics/area";
import { PhysicsObject } from "../nodes/physics/physics-object";
import { CollisionInfo } from "../utils";

export class PhysicsEngine {
    private static physicsObjects: PhysicsObject[] = [];
    private static areas: Area[] = [];
    private static spatialGrid: Map<string, Set<PhysicsObject>> = new Map();
    private static objectCells: Map<PhysicsObject, string[]> = new Map();

    private static readonly GRID_SIZE = 100;
    private static readonly AIR_RESISTANCE = 0.02;
    private static readonly SUBSTEPS = 3;

    public static addPhysicsObject(physicsObject: PhysicsObject): void {
        this.physicsObjects.push(physicsObject);
        this.updateSpatialGrid(physicsObject);
    }

    public static addArea(area: Area): void {
        this.areas.push(area);
    }

    public static removePhysicsObject(physicsObject: PhysicsObject): void {
        const index = this.physicsObjects.indexOf(physicsObject);
        if (index !== -1) {
            this.physicsObjects.splice(index, 1);
            this.removeSpatialGrid(physicsObject);
        }
    }

    public static removeArea(area: Area): void {
        const index = this.areas.indexOf(area);
        if (index !== -1) {
            this.areas.splice(index, 1);
        }
    }

    private static getGridCell(position: Vector2) {
        const x = Math.floor(position.x / this.GRID_SIZE);
        const y = Math.floor(position.y / this.GRID_SIZE);
        return `${x},${y}`;
    }

    private static getOverlappingCells(object: PhysicsObject): string[] {
        const shape = object.getCollisionShape();
        if (!shape) return [];

        const pos = object.getGlobalPosition();
        const vertices = shape.getShape().getVertices();

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        vertices.forEach((vertex) => {
            const worldVertex = vertex.clone().add(pos);
            minX = Math.min(minX, worldVertex.x);
            minY = Math.min(minY, worldVertex.y);
            maxX = Math.max(maxX, worldVertex.x);
            maxY = Math.max(maxY, worldVertex.y);
        });

        const startX = Math.floor(minX / this.GRID_SIZE);
        const startY = Math.floor(minY / this.GRID_SIZE);
        const endX = Math.floor(maxX / this.GRID_SIZE);
        const endY = Math.floor(maxY / this.GRID_SIZE);

        const cells = new Set<string>();
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                cells.add(`${x},${y}`);
            }
        }
        return Array.from(cells);
    }

    private static updateSpatialGrid(object: PhysicsObject) {
        const newCells = this.getOverlappingCells(object);
        const oldCells = this.objectCells.get(object) || [];

        for (const oldCell of oldCells) {
            if (newCells.includes(oldCell)) {
                continue;
            }

            const cellObjects = this.spatialGrid.get(oldCell);
            if (!cellObjects) {
                continue;
            }

            cellObjects.delete(object);
            if (cellObjects.size === 0) {
                this.spatialGrid.delete(oldCell);
            }
        }

        for (const cell of newCells) {
            if (!this.spatialGrid.has(cell)) {
                this.spatialGrid.set(cell, new Set());
            }
            this.spatialGrid.get(cell)?.add(object);
        }

        this.objectCells.set(object, newCells);
    }

    private static removeSpatialGrid(object: PhysicsObject) {
        const cells = this.objectCells.get(object);
        if (cells) {
            cells.forEach((cell) => {
                const objects = this.spatialGrid.get(cell);
                if (objects) {
                    objects.delete(object);
                    if (objects.size === 0) {
                        this.spatialGrid.delete(cell);
                    }
                }
            });
            this.objectCells.delete(object);
        }
    }

    private static getNearbyObjects(object: PhysicsObject) {
        const objectCells = this.getOverlappingCells(object);
        const nearby: Set<PhysicsObject> = new Set();

        // Check all cells this object overlaps and their neighbors
        objectCells.forEach((cell) => {
            const [baseX, baseY] = cell.split(",").map(Number);

            // Check surrounding cells including the current cell
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const checkCell = `${baseX + dx},${baseY + dy}`;
                    const cellObjects = this.spatialGrid.get(checkCell);
                    if (cellObjects) {
                        cellObjects.forEach((obj) => {
                            if (obj !== object) {
                                nearby.add(obj);
                            }
                        });
                    }
                }
            }
        });

        return Array.from(nearby);
    }

    public static update(delta: number) {
        const subDelta = delta / this.SUBSTEPS;

        for (let step = 0; step < this.SUBSTEPS; step++) {
            this.physicsObjects.forEach((obj) => {
                if (obj.isStatic()) {
                    return;
                }

                const velocity = obj.getVelocity();
                const airResistance = velocity
                    .clone()
                    .multiply(-this.AIR_RESISTANCE * obj.getMass());
                obj.applyForce(airResistance);
                obj.updatePhysics(subDelta);
                this.updateSpatialGrid(obj);
            });
        }

        this.resolveCollisions(subDelta);
    }

    private static resolveCollisions(delta: number) {
        for (let i = 0; i < this.physicsObjects.length; i++) {
            const obj = this.physicsObjects[i];
            if (obj.isStatic()) {
                continue;
            }

            const nearbyObjects = this.getNearbyObjects(obj);
            for (let j = 0; j < nearbyObjects.length; j++) {
                const other = nearbyObjects[j];

                if (obj === other) return;

                const thisShape = obj.getCollisionShape();
                const otherShape = other.getCollisionShape();

                if (!thisShape || !otherShape) {
                    continue;
                }

                const collision = thisShape.checkCollision(otherShape);

                if (collision.colliding) {
                    this.resolveCollision(obj, other, collision);
                }
            }
        }
    }

    private static resolveCollision(
        objA: PhysicsObject,
        objB: PhysicsObject,
        collision: CollisionInfo,
    ) {
        if (!collision.mtv) {
            return;
        }

        const relativeVel = objA
            .getVelocity()
            .clone()
            .subtract(objB.getVelocity());
        const normal = collision.mtv.clone().normalize();
        const relativeSpeed = relativeVel.dot(normal);

        // Check if objects are moving away from each other
        if (relativeSpeed < 0) {
            return;
        }

        const massA = objA.getMass();
        const massB = objB.getMass();
        const restitution = Math.min(
            objA.getBounciness(),
            objB.getBounciness(),
        );

        if (objB.isStatic()) {
            objA.setPosition(objA.getGlobalPosition().subtract(collision.mtv));

            const impulse = -(1 + restitution) * relativeSpeed * massA;
            const impulseVector = normal.multiply(impulse);
            objA.setVelocity(
                objA.getVelocity().add(impulseVector.multiply(1 / massA)),
            );
        } else {
            const totalMass = massA + massB;
            const ratioA = massB / totalMass;
            const ratioB = massA / totalMass;

            objA.setPosition(
                objA
                    .getGlobalPosition()
                    .subtract(collision.mtv.clone().multiply(ratioA)),
            );

            objB.setPosition(
                objB
                    .getGlobalPosition()
                    .add(collision.mtv.clone().multiply(ratioB)),
            );

            const impulse =
                (-(1 + restitution) * relativeSpeed * (massA * massB)) /
                totalMass;
            const impulseVector = normal.multiply(impulse);

            objA.setVelocity(
                objA
                    .getVelocity()
                    .add(impulseVector.clone().multiply(1 / massA)),
            );
            objB.setVelocity(
                objB
                    .getVelocity()
                    .subtract(impulseVector.clone().multiply(1 / massB)),
            );
        }

        // Apply friction
        const friction = Math.min(objA.getFriction(), objB.getFriction());
        if (friction > 0) {
            const tangent = new Vector2(-normal.y, normal.x);
            const relativeTangentSpeed = relativeVel.dot(tangent);
            const frictionImpulse = -relativeTangentSpeed * friction;

            if (objB.isStatic()) {
                objA.setVelocity(
                    objA.getVelocity().add(tangent.multiply(frictionImpulse)),
                );
            } else {
                objA.setVelocity(
                    objA
                        .getVelocity()
                        .add(
                            tangent.multiply(
                                (frictionImpulse * massB) / (massA + massB),
                            ),
                        ),
                );
                objB.setVelocity(
                    objB
                        .getVelocity()
                        .subtract(
                            tangent.multiply(
                                (frictionImpulse * massA) / (massA + massB),
                            ),
                        ),
                );
            }
        }

        // objA.onCollision(objB, collision);
        // objB.onCollision(objA, {
        //     ...collision,
        //     mtv: collision.mtv.multiply(-1),
        // });
    }
}
