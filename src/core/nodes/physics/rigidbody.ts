import { PhysicsObject, PhysicsObjectSettings } from "./physics-object";

export class RigidBody extends PhysicsObject {
    constructor(settings?: RigidBodySettings) {
        super(settings);
        this.name = settings?.name ?? "Rigidbody";
    }

    protected _physicsProcess(delta: number): void {
        const movement = this.velocity.clone().multiply(delta);
        this.position.add(movement);
    }

    public isRigid(): boolean {
        return true;
    }
}

export interface RigidBodySettings extends PhysicsObjectSettings {
    momentOfInertia?: number;
}
