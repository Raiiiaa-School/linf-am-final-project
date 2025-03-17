import { CollisionObject } from "./collision-object";
import { PhysicsObject } from "./physics-object";

export class StaticBody extends PhysicsObject {
    constructor(name: string = "") {
        super(name);
    }

    public _process(deltaTime: number): void {
        // Static bodies don't move
    }

    public handleCollision(other: CollisionObject, gap: number): void {
        // Static bodies don't respond to collisions, they just cause other objects to respond
    }
}
