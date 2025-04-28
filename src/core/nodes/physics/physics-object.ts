import { PhysicsEngine } from "../../modules/physics-engine";
import { Vector2 } from "../../utils/vector2";
import { CollisionObject, CollisionObjectSettings } from "./collision-object";
import { CollisionInfo } from "../../utils/collision";

export abstract class PhysicsObject extends CollisionObject {
    protected readonly MAX_FALL_SPEED: number = 1000;

    protected velocity: Vector2;
    protected acceleration: Vector2;
    protected mass: number;
    protected friction: number;
    protected bounciness: number;

    protected gravity: Vector2;
    protected useGravity: boolean;

    protected isGrounded: boolean = false;

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
        // F = ma so a = F/m
        const appliedForce = force.divide(this.mass);
        this.acceleration.add(appliedForce);
    }

    public setPosition(position: Vector2): void {
        this.position = position.clone();
    }

    public getVelocity(): Vector2 {
        return this.velocity.clone();
    }

    public isOnFloor(): boolean {
        return this.isGrounded;
    }

    public checkFloorCollision(collisionInfo: CollisionInfo): void {
        if (!collisionInfo.mtv) {
            return;
        }
        const normal = collisionInfo.mtv.normalize();
        const upDot = normal.dot(new Vector2(0, -1));

        if (upDot > 0.7) {
            this.isGrounded = true;
        }
    }

    public abstract onCollision(
        other: PhysicsObject,
        collisionInfo: CollisionInfo,
    ): void;

    public updatePhysics(delta: number) {
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
