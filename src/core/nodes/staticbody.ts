import { Vector2 } from "../utils/vector2";
import { CollisionObject } from "./collision-object";
import { PhysicsObject, PhysicsObjectSettings } from "./physics-object";

export class StaticBody extends PhysicsObject {
    constructor(settings?: StaticBodySettings) {
        super({
            ...settings,
            mass: Infinity,
            friction: 0,
            useGravity: false,
        });
        this.name = settings?.name ?? "StaticBody";
    }

    protected moveAndCollide(delta: number): void {}

    public applyForce(force: Vector2): void {}

    public onCollision(other: CollisionObject): void {
        if (other instanceof PhysicsObject) {
            other.onCollision(this);
        }
    }

    public setPosition(position: Vector2): void {
        super.setPosition(position);
    }
}

export interface StaticBodySettings extends PhysicsObjectSettings {}
