import { Vector2 } from "../utils/vector2";
import { PhysicsObject, PhysicsObjectSettings } from "./physics-object";

export class Rigidbody extends PhysicsObject {
    private rotationalVelocity: number; // Angular velocity in radians per second
    private rotationalAcceleration: number;
    private torque: number;
    private momentOfInertia: number | undefined; // Resistance to rotational motion

    constructor(settings?: RigidBodySettings) {
        super(settings);
        this.name = settings?.name ?? "Rigidbody";
        this.rotationalVelocity = 0;
        this.rotationalAcceleration = 0;
        this.torque = 0;
    }

    protected _init(): void {
        if (!this.momentOfInertia) {
            this.momentOfInertia = this.calculateMomentOfInertia();
        }
    }

    public update(delta: number) {
        super.moveAndCollide(delta);
        this.updateRotation(delta);
    }

    private updateRotation(delta: number) {
        this.rotationalAcceleration = this.torque / (this.momentOfInertia ?? 1);
        this.rotationalVelocity += this.rotationalAcceleration * delta;
        this.rotationalVelocity *= 1 - this.friction * delta;
        this.rotation += this.rotationalVelocity * delta;
        this.torque = 0;
    }

    public applyForce(force: Vector2, applicationPoint?: Vector2): void {
        super.applyForce(force);

        if (applicationPoint) {
            const r = applicationPoint.subtract(this.position);
            this.torque += r.cross(force);
        }
    }

    public applyImpulse(impulse: Vector2, applicationPoint?: Vector2): void {
        this.velocity = this.velocity.add(impulse.divide(this.mass));

        if (applicationPoint) {
            const r = applicationPoint.subtract(this.position);
            this.rotationalVelocity +=
                r.cross(impulse) / (this.momentOfInertia ?? 1);
        }
    }

    private calculateMomentOfInertia(): number {
        const collisionShape = this.getCollisionShape();
        if (!collisionShape) {
            return (this.mass * (1 + 1)) / 12;
        }

        const shape = collisionShape.getShape();
        const boundingBox = shape.getBounds(collisionShape.getTransform());

        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;

        return (this.mass * (width * width + height * height)) / 12;
    }

    public setRotation(angle: number): void {
        this.rotation = angle;
    }

    public getRotationalVelocity(): number {
        return this.rotationalVelocity;
    }
}

export interface RigidBodySettings extends PhysicsObjectSettings {
    momentOfInertia?: number;
}
