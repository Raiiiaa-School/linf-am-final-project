// Following the mediator and observable patterns
// https://refactoring.guru/design-patterns/mediator

import { CollisionObject } from "../nodes/collision-object";

// https://refactoring.guru/design-patterns/observer
export class CollisionManager {
    private static collisionObjects: CollisionObject[] = [];

    static getCollisionObjects() {
        return CollisionManager.collisionObjects;
    }

    public static addObject(object: CollisionObject) {
        CollisionManager.collisionObjects.push(object);
    }

    public static removeObject(object: CollisionObject) {
        const index = CollisionManager.collisionObjects.indexOf(object);
        if (index !== -1) {
            this.collisionObjects.splice(index, 1);
        }
    }

    public static update() {
        for (let i = 0; i < CollisionManager.collisionObjects.length; i++) {
            const object1 = CollisionManager.collisionObjects[i];
            const shape1 = object1.getCollisionShape();
            if (!shape1) {
                continue;
            }

            for (
                let j = i + 1;
                j < CollisionManager.collisionObjects.length;
                j++
            ) {
                const object2 = CollisionManager.collisionObjects[j];
                const shape2 = object2.getCollisionShape();
                if (!shape2) {
                    continue;
                }

                if (!object1.canCollideWith(object2)) {
                    continue;
                }

                if (shape1.checkCollision(shape2)) {
                    console.log("Im here?");
                    object1.onCollision(object2);
                    object2.onCollision(object1);
                }
            }
        }
    }
}
