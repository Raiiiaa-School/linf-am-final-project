import { Area } from "../nodes/physics/area";
import { CollisionObject } from "../nodes/physics/collision-object";
import { PhysicsObject } from "../nodes/physics/physics-object";

export class PhysicsEngine {
    private static physicsObjects: PhysicsObject[] = [];
    private static areas: Area[] = [];

    public static addPhysicsObject(physicsObject: PhysicsObject): void {
        this.physicsObjects.push(physicsObject);
    }

    public static addArea(area: Area): void {
        this.areas.push(area);
    }

    public static removePhysicsObject(physicsObject: PhysicsObject): void {
        const index = this.physicsObjects.indexOf(physicsObject);
        if (index !== -1) {
            this.physicsObjects.splice(index, 1);
        }
    }

    public static removeArea(area: Area): void {
        const index = this.areas.indexOf(area);
        if (index !== -1) {
            this.areas.splice(index, 1);
        }
    }

    public static update(delta: number) {
        this.physicsObjects.forEach((object) => {
            object.updatePhysics(delta);
        });

        this.checkCollisions();
    }

    private static checkCollisions() {
        for (let i = 0; i < this.physicsObjects.length; i++) {
            const thisObj = this.physicsObjects[i];
            for (let j = i + 1; j < this.physicsObjects.length; j++) {
                const otherObj = this.physicsObjects[j];

                if (!thisObj.canCollideWith(otherObj)) {
                    continue;
                }

                const thisShape = thisObj.getCollisionShape();
                const otherShape = otherObj.getCollisionShape();

                if (!thisShape || !otherShape) {
                    continue;
                }

                const collisionInfo = thisShape.checkCollision(otherShape);

                if (collisionInfo.colliding) {
                    thisObj.onCollision(otherObj, collisionInfo);

                    if (collisionInfo.mtv) {
                        collisionInfo.mtv.multiply(-1);
                    }

                    // For debug purposes
                    //
                    // console.log(
                    //     `Node "${thisObj.getName()}" collided with "${otherObj.getName()}"\nOverlapping: ${collisionInfo.overlap}`,
                    // );

                    otherObj.onCollision(thisObj, collisionInfo);
                }
            }
        }
    }
}
