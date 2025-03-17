import { Vector2 } from "../utils/vector";
import { CollisionObject } from "./collision-object";

export abstract class PhysicsObject extends CollisionObject {
    protected velocity: Vector2 = new Vector2();
    protected acceleration: Vector2 = new Vector2();
    protected mass: number = 1;

    constructor(name: string = "") {
        super(name);
    }

    public setVelocity(x: number, y: number): PhysicsObject {
        this.velocity.x = x;
        this.velocity.y = y;
        return this;
    }

    public getVelocity(): Vector2 {
        return this.velocity.clone();
    }

    public setAcceleration(x: number, y: number): PhysicsObject {
        this.acceleration.x = x;
        this.acceleration.y = y;
        return this;
    }

    public setMass(mass: number): PhysicsObject {
        this.mass = mass;
        return this;
    }

    public applyForce(force: Vector2): void {
        const acceleration = force.divide(this.mass);
        this.acceleration = this.acceleration.add(acceleration);
    }

    public applyImpulse(impulse: Vector2): void {
        const deltaVelocity = impulse.divide(this.mass);
        this.velocity = this.velocity.add(deltaVelocity);
    }

    abstract handleCollision(other: CollisionObject, gap: number): void;
}
