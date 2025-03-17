import { Area2D } from "./nodes/area";
import { CollisionObject } from "./nodes/collision-object";
import { PhysicsObject } from "./nodes/physics-object";

export class PhysicsEngine {
    private physicsObjects: PhysicsObject[] = [];
    private areas: Area2D[] = [];

    public addPhysicsObject(object: PhysicsObject): PhysicsEngine {
        this.physicsObjects.push(object);
        return this;
    }

    public removePhysicsObject(object: PhysicsObject): PhysicsEngine {
        const index = this.physicsObjects.indexOf(object);
        if (index !== -1) {
            this.physicsObjects.splice(index, 1);
        }
        return this;
    }

    public addArea(area: Area2D): PhysicsEngine {
        this.areas.push(area);
        return this;
    }

    public removeArea(area: Area2D): PhysicsEngine {
        const index = this.areas.indexOf(area);
        if (index !== -1) {
            this.areas.splice(index, 1);
        }
        return this;
    }

    public update(deltaTime: number): void {
        this.physicsObjects.forEach((object) => {
            object._process(deltaTime);
        });

        this.checkCollisions();
    }

    private checkCollisions(): void {
        for (let i = 0; i < this.physicsObjects.length; i++) {
            const objectA = this.physicsObjects[i];

            for (let j = i + 1; j < this.physicsObjects.length; j++) {
                const objectB = this.physicsObjects[j];

                if (!objectA.canCollideWith(objectB)) {
                    continue;
                }

                const collisionResult = this.checkObjectCollision(
                    objectA,
                    objectB
                );
                if (collisionResult.collided) {
                    objectA.handleCollision(objectB, collisionResult.gap);
                    objectB.handleCollision(objectA, collisionResult.gap);
                }
            }
        }
    }

    private checkObjectCollision(
        objectA: PhysicsObject,
        objectB: PhysicsObject
    ): { collided: boolean; gap: number } {
        const shapesA = objectA.getCollisionShapes();
        const shapesB = objectB.getCollisionShapes();

        let minGap = Infinity;
        let collided = false;

        for (const shapeA of shapesA) {
            for (const shapeB of shapesB) {
                const aabbA = shapeA.getGlobalShape().getAABB();
                const aabbB = shapeB.getGlobalShape().getAABB();

                if (aabbA.intersects(aabbB)) {
                    collided = true;

                    const velocity = objectA.getVelocity();
                    const gap = aabbA.getGap(aabbB, velocity);

                    if (gap < minGap) {
                        minGap = gap;
                    }
                }
            }
        }
        return {
            collided,
            gap: minGap,
        };
    }

    private checkAreaOverlaps(): void {
        for (const area of this.areas) {
            const currentOverlaps = new Set<CollisionObject>();

            for (const physicsObject of this.physicsObjects) {
                if (!area.canCollideWith(physicsObject)) {
                    continue;
                }

                const shapesA = area.getCollisionShapes();
                const shapesB = physicsObject.getCollisionShapes();

                let overlapping = false;

                for (const shapeA of shapesA) {
                    for (const shapeB of shapesB) {
                        const aabbA = shapeA.getGlobalShape().getAABB();
                        const aabbB = shapeB.getGlobalShape().getAABB();

                        if (aabbA.intersects(aabbB)) {
                            overlapping = true;
                            break;
                        }
                    }
                    if (overlapping) break;
                }

                if (overlapping) {
                    currentOverlaps.add(physicsObject);
                }
            }

            for (const otherArea of this.areas) {
                if (area === otherArea || !area.canCollideWith(otherArea)) {
                    continue;
                }

                const shapesA = area.getCollisionShapes();
                const shapesB = otherArea.getCollisionShapes();

                let overlapping = false;

                for (const shapeA of shapesA) {
                    for (const shapeB of shapesB) {
                        const aabbA = shapeA.getGlobalShape().getAABB();
                        const aabbB = shapeB.getGlobalShape().getAABB();

                        if (aabbA.intersects(aabbB)) {
                            overlapping = true;
                            break;
                        }
                    }
                    if (overlapping) break;
                }

                if (overlapping) {
                    currentOverlaps.add(otherArea);
                }
            }

            const overlappingAreas = new Set(area.getOverlappingAreas());

            for (const object of currentOverlaps) {
                if (!overlappingAreas.has(object)) {
                    area.handleAreaEntered(object);
                }
            }
            for (const object of overlappingAreas) {
                if (!currentOverlaps.has(object)) {
                    area.handleAreaExited(object);
                }
            }
        }
    }
}
