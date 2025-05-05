import { Vector2 } from "../../utils/vector2";
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

    public updatePhysics(delta: number): void {}

    protected _physicsProcess(delta: number): void {}

    protected moveAndCollide(delta: number): void {}

    public applyForce(force: Vector2): void {}

    public isStatic(): boolean {
        return true;
    }
}

export interface StaticBodySettings extends PhysicsObjectSettings {}
