import { Vector2 } from "../utils/vector";
import { CollisionObject } from "./collision-object";
import { PhysicsObject } from "./physics-object";

export class RigidBody extends PhysicsObject {
    private gravity: Vector2 = new Vector2();
    private linearDamping: number = 0.01;
    private bounciness: number = 0.5;

    constructor(name: string = "") {
        super(name);
    }

    public setGravity(x: number, y: number): RigidBody {
        this.gravity.x = x;
        this.gravity.y = y;
        return this;
    }

    public setLinearDamping(damping: number): RigidBody {
        this.linearDamping = damping;
        return this;
    }

    public setBounciness(bounciness: number): RigidBody {
        this.bounciness = bounciness;
        return this;
    }

    public _process(deltaTime: number): void {
        this.acceleration = this.acceleration.add(this.gravity);

        this.velocity = this.velocity
            .add(this.acceleration.multiply(deltaTime))
            .multiply(1 - this.linearDamping * deltaTime);

        this.position = this.position.add(this.velocity.multiply(deltaTime));

        this.acceleration = new Vector2();
    }

    public handleCollision(other: CollisionObject, gap: number): void {
        if (gap < 0) {
            const collisionNormal = this.velocity.normalize().multiply(-1);

            const velocityMagnitude = this.velocity.magnitude();
            const newVelocityMagnitude = Math.max(0, velocityMagnitude + gap);

            if (velocityMagnitude > 0) {
                this.velocity = this.velocity.normalize();
            }

            if (this.bounciness > 0 && velocityMagnitude > 0) {
                const bounce = collisionNormal.multiply(
                    this.bounciness * velocityMagnitude
                );
                this.velocity = this.velocity.add(bounce);
            }
        }
    }
}
