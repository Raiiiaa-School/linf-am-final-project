import { Vector2 } from "../utils/vector";
import { CollisionObject } from "./collision-object";
import { PhysicsObject } from "./physics-object";

export class CharacterBody extends PhysicsObject {
    private maxSpeed: number = 100;
    private friction: number = 0.8;
    private onFloor: boolean = false;
    private floorNormal: Vector2 = new Vector2(0, -1);

    constructor(name: string = "") {
        super(name);
    }

    public setMaxSpeed(speed: number): CharacterBody {
        this.maxSpeed = speed;
        return this;
    }

    public setFriction(friction: number): CharacterBody {
        this.friction = friction;
        return this;
    }

    public isOnFloor(): boolean {
        return this.onFloor;
    }

    public getFloorNormal(): Vector2 {
        return this.floorNormal.clone();
    }

    public _process(deltaTime: number): void {
        this.onFloor = false;

        this.position = this.position.add(this.velocity.multiply(deltaTime));

        this.velocity = this.velocity.multiply(
            Math.pow(this.friction, deltaTime)
        );

        const speed = this.velocity.magnitude();
        if (speed > this.maxSpeed) {
            this.velocity = this.velocity.normalize().multiply(this.maxSpeed);
        }

        this.acceleration = new Vector2();
    }

    public handleCollision(other: CollisionObject, gap: number): void {
        if (gap < 0) {
            const collisionNormal = this.velocity.normalize().multiply(-1);
            if (collisionNormal.y < -0.7) {
                this.onFloor = true;
                this.floorNormal = collisionNormal;
            }

            const velocityMagnitude = this.velocity.magnitude();
            const newVelocityMagnitude = Math.max(0, velocityMagnitude + gap);

            if (velocityMagnitude > 0) {
                this.velocity = this.velocity.normalize();
            }

            if (this.onFloor) {
                const projectedVelocity = this.velocity.subtract(
                    this.floorNormal.multiply(
                        this.velocity.dot(this.floorNormal)
                    )
                );
                this.velocity = projectedVelocity;
            }
        }
    }
}
