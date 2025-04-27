import { CollisionManager } from "../manager/collision-manager";
import { Vector2 } from "../utils/vector2";
import { CollisionObject, CollisionObjectSettings } from "./collision-object";

export abstract class PhysicsObject extends CollisionObject {
    protected velocity: Vector2;
    protected acceleration: Vector2;
    protected mass: number;
    protected friction: number;
    protected bounciness: number;
    protected gravity: Vector2;
    protected useGravity: boolean;

    constructor(settings?: PhysicsObjectSettings) {
        super(settings);
        this.velocity = Vector2.ZERO;
        this.acceleration = Vector2.ZERO;
        this.mass = settings?.mass ?? 1;
        this.friction = settings?.friction ?? 0.9;
        this.bounciness = settings?.bounciness ?? 0.5;
        this.gravity = settings?.gravity ?? new Vector2(0, 981); // Default gravity
        this.useGravity = settings?.useGravity ?? true;
    }

    protected moveAndCollide(delta: number) {
        if (this.useGravity) {
            this.velocity.x += this.gravity.x * delta;
            this.velocity.y += this.gravity.y * delta;
        }

        this.velocity.x += this.acceleration.x * delta;
        this.velocity.y += this.acceleration.y * delta;

        this.velocity.x *= 1 - this.friction * delta;
        this.velocity.y *= 1 - this.friction * delta;

        this.velocity.y = Math.min(this.velocity.y, 2000);

        const potentialPosition = new Vector2(
            this.position.x + this.velocity.x * delta,
            this.position.y + this.velocity.y * delta,
        );
        this.setPosition(potentialPosition);
    }

    public applyForce(force: Vector2) {
        // F = ma so a = F/m
        const appliedForce = force.divide(this.mass);
        this.acceleration.add(appliedForce);
    }

    public setPosition(position: Vector2): void {
        this.position = position.clone();
    }

    public onCollision(other: CollisionObject): void {
        console.log("Do i colide?", "yeah stupid");
        if (other instanceof PhysicsObject) {
            this.resolveCollision(other);
        } else {
            this.preventCollision(other);
        }
    }

    private resolveCollision(other: PhysicsObject) {
        const relativeVelocity = this.velocity.subtract(other.velocity);

        const thisPos = this.getGlobalPosition();
        const otherPos = other.getGlobalPosition();
        const collisionNormal = thisPos.subtract(otherPos).normalize();

        const velocityAlongNormal = relativeVelocity.dot(collisionNormal);

        if (velocityAlongNormal > 0) {
            return;
        }

        const e = Math.min(this.bounciness, other.bounciness);
        let j = -(1 + e) * velocityAlongNormal;
        j /= 1 / this.mass + 1 / other.mass;

        const impulse = collisionNormal.multiply(j);
        this.velocity = this.velocity.subtract(impulse.multiply(1 / this.mass));
        other.velocity = other.velocity.add(impulse.multiply(1 / this.mass));

        this.preventCollision(other);
    }

    private preventCollision(other: CollisionObject) {
        const thisShape = this.getCollisionShape();
        const otherShape = other.getCollisionShape();
        if (!thisShape || !otherShape) {
            return;
        }

        const thisPos = this.getGlobalPosition();
        const otherPos = other.getGlobalPosition();

        const direction = thisPos.subtract(otherPos).normalize();
        const distance = thisPos.distance(otherPos);

        if (distance === 0) {
            this.position.x += 0.1;
            return;
        }

        const correction = direction.multiply(0.1);
        this.position = this.position.add(correction);
    }
}

export interface PhysicsObjectSettings extends CollisionObjectSettings {
    mass?: number;
    friction?: number;
    bounciness?: number;
    gravity?: Vector2;
    useGravity?: boolean;
}
