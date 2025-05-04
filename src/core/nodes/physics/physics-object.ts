import { PhysicsEngine } from "../../systems/physics-engine";
import { Vector2 } from "../../utils/vector2";
import { CollisionObject, CollisionObjectSettings } from "./collision-object";
import { CollisionInfo } from "../../utils/collision";
import { StaticBody } from "./staticbody";
import { Node2D } from "../node";

export abstract class PhysicsObject extends CollisionObject {
    protected readonly MAX_FALL_SPEED: number = 2500;

    protected velocity: Vector2;
    protected acceleration: Vector2;
    protected mass: number;
    protected friction: number;
    protected bounciness: number;

    protected gravity: Vector2;
    protected useGravity: boolean;

    protected isGrounded: boolean = false;
    protected floorNormal = Vector2.DOWN;

    constructor(settings?: PhysicsObjectSettings) {
        super(settings);
        this.velocity = Vector2.ZERO;
        this.acceleration = Vector2.ZERO;
        this.mass = settings?.mass ?? 1;
        this.friction = settings?.friction ?? 0.01;
        this.bounciness = settings?.bounciness ?? 0.5;
        this.gravity = settings?.gravity ?? new Vector2(0, 980); // Default gravity
        this.useGravity = settings?.useGravity ?? true;

        PhysicsEngine.addPhysicsObject(this);
    }

    public applyForce(force: Vector2) {
        // F = ma entao a = F/m
        const appliedForce = force.divide(this.mass);
        this.acceleration.add(appliedForce);
    }

    public setPosition(position: Vector2): void {
        this.position = position.clone();
    }

    public getVelocity(): Vector2 {
        return this.velocity.clone();
    }

    public getMass(): number {
        return this.mass;
    }

    public getBounciness(): number {
        return this.bounciness;
    }

    public setVelocity(velocity: Vector2): void {
        this.velocity = velocity.clone();
    }

    public isOnFloor(): boolean {
        return this.isGrounded;
    }

    public checkFloorCollision(
        body: PhysicsObject,
        collisionInfo: CollisionInfo,
    ): void {
        if (!collisionInfo.mtv) {
            return;
        }

        const normal = collisionInfo.mtv.clone().normalize();
        const upDot = normal.clone().dot(Vector2.DOWN);

        if (upDot > 0.7) {
            this.isGrounded = true;
        }
    }

    protected moveTowards(from: number, to: number, delta: number): number {
        if (Math.abs(to - from) <= delta) {
            return to;
        }
        if (from < to) {
            return from + delta;
        } else {
            return from - delta;
        }
    }

    public abstract onCollision(
        other: PhysicsObject,
        collisionInfo: CollisionInfo,
    ): void;

    public updatePhysics(delta: number) {
        if (this.useGravity) {
            const newVelY = this.velocity.y + this.gravity.y * delta;
            this.velocity.y = Math.min(newVelY, this.MAX_FALL_SPEED);
        }

        this.velocity.add(
            this.acceleration.clone().multiply(this.mass).multiply(delta),
        );
        this.velocity.multiply(1 - this.friction * delta);
        this.velocity.x = this.moveTowards(this.velocity.x, 0, this.friction);
        this.isGrounded = false;

        this._physicsProcess(delta);
    }

    protected _physicsProcess(delta: number): void {}
}

export interface PhysicsObjectSettings extends CollisionObjectSettings {
    mass?: number;
    friction?: number;
    bounciness?: number;
    gravity?: Vector2;
    useGravity?: boolean;
}
