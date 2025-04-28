import { CollisionInfo } from "src/core/utils/collision";
import { Vector2 } from "../../utils/vector2";
import { PhysicsObject, PhysicsObjectSettings } from "./physics-object";
import { StaticBody } from "./staticbody";

export class Rigidbody extends PhysicsObject {
    constructor(settings?: RigidBodySettings) {
        super(settings);
        this.name = settings?.name ?? "Rigidbody";
    }

    public updatePhysics(delta: number): void {
        if (this.useGravity && !this.isGrounded) {
            const newVelY = this.velocity.y + this.gravity.y * delta;
            this.velocity.y = Math.min(newVelY, this.MAX_FALL_SPEED);
        }

        this.velocity.add(this.acceleration.clone().multiply(delta));
        this.velocity.multiply(1 - this.friction * delta);

        const movement = this.velocity.clone().multiply(delta);
        this.position.add(movement);

        this._physicsProcess(delta);
    }

    public onCollision(
        other: PhysicsObject,
        collisionInfo: CollisionInfo,
    ): void {
        if (!collisionInfo.mtv) return;

        if (other instanceof StaticBody) {
            // Handle collision with static body
            this.handleStaticCollision(collisionInfo);
        } else if (other instanceof Rigidbody) {
            // Handle collision with another rigidbody
            this.handleDynamicCollision(other, collisionInfo);
        }
    }

    private handleStaticCollision(collisionInfo: CollisionInfo): void {
        if (!collisionInfo.mtv) return;

        this.position.subtract(collisionInfo.mtv);
        const normal = collisionInfo.mtv.normalize();

        this.checkFloorCollision(collisionInfo);

        if (this.isGrounded) {
            if (this.velocity.y > 0) {
                this.velocity.y = 0;
            }
            return;
        }

        const velocityAlongNormal = this.velocity.clone().dot(normal);
        if (velocityAlongNormal < 0) {
            const bounceVelocity = normal
                .clone()
                .multiply(velocityAlongNormal * 1 + this.bounciness);
            this.velocity.subtract(bounceVelocity);
        }
    }

    private handleDynamicCollision(
        other: Rigidbody,
        collisionInfo: CollisionInfo,
    ): void {
        if (!collisionInfo.mtv) return;

        const totalMass = this.mass + other.mass;
        const thisRatio = this.mass / totalMass;
        const otherRatio = other.mass / totalMass;

        // Separate objects
        const separation = collisionInfo.mtv;
        this.position.subtract(separation.multiply(thisRatio));
        other.position.add(separation.multiply(otherRatio));

        // Calculate collision response
        const normal = collisionInfo.mtv.normalize();
        const relativeVelocity = this.velocity.clone().subtract(other.velocity);
        const velocityAlongNormal = relativeVelocity.dot(normal);

        if (velocityAlongNormal > 0) return;

        const restitution = Math.min(this.bounciness, other.bounciness);
        const impulseStrength = -(1 + restitution) * velocityAlongNormal;
        const impulse = normal.multiply(impulseStrength);

        // Apply impulse
        this.velocity.subtract(impulse.multiply(1 / this.mass));
        other.velocity.add(impulse.multiply(1 / other.mass));
    }

    protected _physicsProcess(delta: number): void {}
}

export interface RigidBodySettings extends PhysicsObjectSettings {
    momentOfInertia?: number;
}
