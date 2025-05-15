import { PhysicsEngine } from "../../systems/physics-engine";
import { Vector2 } from "../../utils/vector2";
import { CollisionObject, CollisionObjectSettings } from "./collision-object";
import { CollisionInfo } from "../../utils/collision";
import { StaticBody } from "./staticbody";
import { Node2D } from "../node";
import { Signal } from "../../utils";

export abstract class PhysicsObject extends CollisionObject {
    public readonly MAX_FALL_SPEED: number = 5000;
    protected readonly ANGULAR_DAMPING = 0.98;

    protected previousPosition?: Vector2;
    protected velocity: Vector2;
    protected acceleration: Vector2;
    protected angularVelocity: number;
    protected mass: number;
    protected friction: number;
    protected bounciness: number;

    protected gravity: Vector2;
    protected useGravity: boolean;

    protected isGrounded: boolean = false;
    protected floorNormal: Vector2 = Vector2.UP;
    protected groundedTolerance: number = 0.7; // cos of maximum angle to consider floor

    public readonly onCollision = new Signal<PhysicsObject>();
    public readonly onBodyEntered = new Signal<PhysicsObject>();
    public readonly onBodyExited = new Signal<PhysicsObject>();
    public readonly onBodyStayed = new Signal<PhysicsObject>();

    constructor(settings?: PhysicsObjectSettings) {
        super(settings);
        this.velocity = Vector2.ZERO;
        this.acceleration = Vector2.ZERO;
        this.angularVelocity = 0;
        this.mass = settings?.mass ?? 1;
        this.friction = settings?.friction ?? 0.5;
        this.bounciness = settings?.bounciness ?? 0.3;
        this.gravity = settings?.gravity ?? new Vector2(0, 980); // Default gravity
        this.useGravity = settings?.useGravity ?? true;
    }

    protected _init(): void {
        PhysicsEngine.addPhysicsObject(this);
    }

    public setPosition(position: Vector2): void {
        this.position = position.clone();
    }

    public getVelocity(): Vector2 {
        return this.velocity.clone();
    }

    public setVelocity(velocity: Vector2): void {
        const maxSpeed = 1000;
        if (velocity.length() > maxSpeed) {
            velocity.normalize().multiply(maxSpeed);
        }
        this.velocity = velocity.clone();
    }

    public setVelocityX(velocityX: number): void {
        const maxSpeed = 1000;
        if (Math.abs(velocityX) > maxSpeed) {
            velocityX = Math.sign(velocityX) * maxSpeed;
        }
        this.velocity.x = velocityX;
    }

    public setVelocityY(velocityY: number): void {
        const maxSpeed = 1000;
        if (Math.abs(velocityY) > maxSpeed) {
            velocityY = Math.sign(velocityY) * maxSpeed;
        }
        this.velocity.y = velocityY;
    }

    public getPreviousPosition(): Vector2 | undefined {
        return this.previousPosition;
    }

    public setPreviousPosition(position: Vector2): void {
        this.previousPosition = position;
    }

    public getMass(): number {
        return this.mass;
    }

    public getBounciness(): number {
        return this.bounciness;
    }

    public getFriction(): number {
        return this.friction;
    }

    public getGravity(): Vector2 {
        return this.gravity;
    }

    public isOnFloor(): boolean {
        return this.isGrounded;
    }

    public isCharacter(): boolean {
        return false;
    }

    public isRigid(): boolean {
        return false;
    }

    public isStatic(): boolean {
        return false;
    }
    public applyForce(force: Vector2) {
        if (this.isStatic()) return;
        // F = ma entao a = F/m
        const appliedForce = force.divide(this.mass);
        this.acceleration.add(appliedForce);
    }

    public applyImpulse(impulse: Vector2): void {
        if (this.isStatic()) return;
        const appliedImpulse = impulse.divide(this.mass);
        this.velocity.add(appliedImpulse);
    }

    public applyTorque(torque: number): void {
        if (this.isStatic()) return;
        this.angularVelocity += torque / this.mass;
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

        if (upDot > this.groundedTolerance) {
            this.isGrounded = true;
            this.floorNormal = normal;
        }
    }

    protected integrateForces(delta: number) {
        if (this.isStatic()) return;

        if (this.useGravity) {
            this.velocity.add(this.gravity.clone().multiply(delta));

            if (this.velocity.y > this.MAX_FALL_SPEED) {
                this.velocity.y = this.MAX_FALL_SPEED;
            }
        }

        this.velocity.add(this.acceleration.multiply(delta));
        this.angularVelocity *= Math.pow(this.ANGULAR_DAMPING, delta);
        this.acceleration = Vector2.ZERO;
    }

    protected integrateVelocity(delta: number) {
        if (this.isStatic()) return;

        const movement = this.velocity.clone().multiply(delta);
        this.position.add(movement);

        this.rotation += this.angularVelocity * delta;
        this.isGrounded = false;
    }

    public updatePhysics(delta: number) {
        this.integrateForces(delta);
        this.integrateVelocity(delta);
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
