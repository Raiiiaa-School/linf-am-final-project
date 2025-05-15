import { Vector2 } from "../utils/vector2";
import { Area } from "../nodes/physics/area";
import { PhysicsObject } from "../nodes/physics/physics-object";
import { CollisionInfo } from "../utils";
import { CharacterBody, RigidBody } from "../nodes";

export class PhysicsEngine {
    private static physicsObjects: PhysicsObject[] = [];
    private static areas: Area[] = [];

    private static areaSpatialGrid: Map<string, Set<Area>> = new Map();
    private static spatialGrid: Map<string, Set<PhysicsObject>> = new Map();
    private static areaCells: Map<Area, string[]> = new Map();
    private static objectCells: Map<PhysicsObject, string[]> = new Map();

    private static readonly GRID_SIZE = 100;
    private static readonly AIR_RESISTANCE = 0.02;
    private static readonly SUBSTEPS = 3;
    private static readonly VELOCITY_THRESHOLD = 300;

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

    private static getOverlappingCells<T extends PhysicsObject | Area>(
        object: T,
    ): string[] {
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

    private static updateSpatialGrid<T extends PhysicsObject | Area>(
        object: T,
    ) {
        const isArea = object instanceof Area;
        const cells = isArea ? this.areaCells : this.objectCells;
        const newCells = this.getOverlappingCells(object);
        const oldCells = isArea
            ? (cells.get(object as Area & PhysicsObject) ?? [])
            : (cells.get(object as Area & PhysicsObject) ?? []);
        const spatialGrid = isArea ? this.areaSpatialGrid : this.spatialGrid;

        for (const oldCell of oldCells) {
            if (newCells.includes(oldCell)) {
                continue;
            }

            const cellObjects = spatialGrid.get(oldCell);
            if (!cellObjects) {
                continue;
            }

            cellObjects.delete(object as any);
            if (cellObjects.size === 0) {
                spatialGrid.delete(oldCell);
            }
        }

        for (const cell of newCells) {
            if (!spatialGrid.has(cell)) {
                spatialGrid.set(cell, new Set<Area & PhysicsObject>());
            }
            spatialGrid.get(cell)?.add(object as Area & PhysicsObject);
        }

        cells.set(object as Area & PhysicsObject, newCells);
    }

    private static removeSpatialGrid<T extends PhysicsObject | Area>(
        object: T,
    ) {
        const isArea = object instanceof Area;
        const cells = isArea ? this.areaCells : this.objectCells;
        const newCells = this.getOverlappingCells(object);
        const oldCells = isArea
            ? (cells.get(object as Area & PhysicsObject) ?? [])
            : (cells.get(object as Area & PhysicsObject) ?? []);
        const spatialGrid = isArea ? this.areaSpatialGrid : this.spatialGrid;

        const objectCells = cells.get(object as Area & PhysicsObject);
        if (!objectCells) {
            return;
        }

        objectCells.forEach((cell) => {
            const objects = spatialGrid.get(cell);
            if (objects) {
                objects.delete(object as Area & PhysicsObject);
                if (objects.size === 0) {
                    spatialGrid.delete(cell);
                }
            }
        });
        cells.delete(object as Area & PhysicsObject);
    }

    private static getNearbyObjects<T extends Area | PhysicsObject>(object: T) {
        const isArea = object instanceof Area;
        const objectCells = this.getOverlappingCells(object);
        const spatialGrid = isArea ? this.areaSpatialGrid : this.spatialGrid;
        const nearby = new Set<T>();

        // Check all cells this object overlaps and their neighbors
        objectCells.forEach((cell) => {
            const [baseX, baseY] = cell.split(",").map(Number);

            // Check surrounding cells including the current cell
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const checkCell = `${baseX + dx},${baseY + dy}`;
                    const cellObjects = spatialGrid.get(checkCell);
                    if (cellObjects) {
                        cellObjects.forEach((obj) => {
                            if (obj === object) {
                                return;
                            }

                            nearby.add(obj as T);
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

                if (!obj.isEnabled()) {
                    return;
                }

                const velocity = obj.getVelocity();

                if (velocity.length() > this.VELOCITY_THRESHOLD) {
                    obj.setPreviousPosition(obj.position.clone());
                }

                const airResistance = velocity
                    .clone()
                    .multiply(-this.AIR_RESISTANCE * obj.getMass());
                obj.applyForce(airResistance);
                obj.updatePhysics(subDelta);
                this.updateSpatialGrid(obj);
            });
            this.resolveCollisions(subDelta);

            this.areas.forEach((area) => {
                if (!area.isMonitoring()) {
                    return;
                }

                this.updateSpatialGrid(area);
            });

            this.resolveAreas(delta);
        }
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

        objA.checkFloorCollision(objB, collision);

        if (objA.isOnFloor()) {
            const currentVel = objA.getVelocity();
            objA.setVelocity(new Vector2(currentVel.x, 0));
        }

        if (objA.isCharacter() && objB.isRigid()) {
            objB.setPosition(objB.position.add(collision.mtv));
        } else if (objA.isRigid() && objB.isRigid()) {
            const halfMtv = collision.mtv.clone().divide(2);
            objA.setPosition(objA.position.subtract(halfMtv));
            objB.setPosition(objB.position.add(halfMtv));
        } else {
            objA.setPosition(objA.position.subtract(collision.mtv));
        }
    }

    private static resolveAreas(delta: number) {
        for (let i = 0; i < this.areas.length; i++) {
            const area = this.areas[i];

            if (!area.isMonitoring()) {
                continue;
            }

            const nearbyObjects = this.getNearbyObjects(area);

            for (let j = 0; j < nearbyObjects.length; j++) {
                const other = nearbyObjects[j];

                if (!other.isMonitorable()) {
                    return;
                }

                if (area === other) {
                    return;
                }

                const thisShape = area.getCollisionShape();
                const otherShape = other.getCollisionShape();

                if (!thisShape || !otherShape) {
                    continue;
                }

                const collision = thisShape.checkCollision(otherShape);

                if (!collision.colliding) {
                    if (area.getOverlappingAreas().has(other)) {
                        area.removeOverlappingArea(other);
                    }
                    continue;
                }
                this.resolveAreaCollision(area, other, collision);
            }
        }
    }

    private static resolveAreaCollision(
        areaA: Area,
        areaB: Area,
        collision: CollisionInfo,
    ) {
        if (!collision.mtv) {
            return;
        }

        areaA.addOverlappingArea(areaB);
        areaB.addOverlappingArea(areaA);
    }
}
