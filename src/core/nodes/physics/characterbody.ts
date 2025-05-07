import { PhysicsObject, PhysicsObjectSettings } from "./physics-object";
import { CollisionInfo, Vector2 } from "../../utils";

export class CharacterBody extends PhysicsObject {
    protected snapToGround: boolean;
    protected maxSlopeAngle: number;
    protected jumpForce: number;

    constructor(settings?: CharacterBodySettings) {
        super(settings);
        this.name = settings?.name ?? "CharacterBody";
        this.friction = settings?.friction ?? 0.2;
        this.mass = settings?.mass ?? 1;

        this.snapToGround = settings?.snapToGround ?? true;
        this.maxSlopeAngle = settings?.maxSlopeAngle ?? 45;
        this.jumpForce = settings?.jumpForce ?? 400;

        // Convert maxSlopeAngle to groundedTolerance
        this.groundedTolerance = Math.cos(
            ((90 - this.maxSlopeAngle) * Math.PI) / 100,
        );
    }

    public isCharacter(): boolean {
        return true;
    }

    protected moveTowards(from: number, to: number, delta: number): number {
        if (Math.abs(to - from) <= delta) {
            return to;
        }
        return from + Math.sign(to - from) * delta;
    }

    protected moveAndSlide(velocity: Vector2, delta: number) {
        this.velocity = velocity;
        this.integrateVelocity(delta);
    }

    public updatePhysics(delta: number): void {
        this._physicsProcess(delta);
    }
}

export interface CharacterBodySettings extends PhysicsObjectSettings {
    snapToGround?: boolean;
    maxSlopeAngle?: number;
    jumpForce?: number;
}
