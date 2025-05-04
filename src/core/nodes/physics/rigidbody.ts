import { CollisionInfo } from "src/core/utils/collision";
import { Vector2 } from "../../utils/vector2";
import { PhysicsObject, PhysicsObjectSettings } from "./physics-object";
import { StaticBody } from "./staticbody";
import { Node2D } from "../node";
import { CharacterBody } from "./charactedbody";

export class RigidBody extends PhysicsObject {
    constructor(settings?: RigidBodySettings) {
        super(settings);
        this.name = settings?.name ?? "Rigidbody";
    }

    public onCollision(
        other: PhysicsObject,
        collisionInfo: CollisionInfo,
    ): void {
        if (!collisionInfo.mtv) return;
        this.checkFloorCollision(other, collisionInfo);
        this.handleCollision(other, collisionInfo);
    }

    private handleCollision(
        other: PhysicsObject,
        collisionInfo: CollisionInfo,
    ): void {
        if (!collisionInfo.mtv) {
            return;
        }

        const thisMass = this.mass;
        const otherMass = other.getMass();

        const thisVelocity = this.velocity.clone();
        const otherVelocity = other.getVelocity().clone();

        const collisionNormal = collisionInfo.mtv.clone().normalize();
        const relativeVelocity = thisVelocity
            .clone()
            .subtract(otherVelocity)
            .dot(collisionNormal);

        const bounceForce = Math.min(this.bounciness, other.getBounciness());

        const impulseMagnitude =
            (-(1 + bounceForce) * relativeVelocity) /
            (1 / thisMass + 1 / otherMass);

        const impulseVector = collisionNormal
            .clone()
            .multiply(impulseMagnitude);

        this.resolvePenetration(this, other, collisionInfo);

        this.velocity.add(impulseVector.clone().divide(thisMass));

        if (other instanceof StaticBody) {
            return;
        }

        other
            .getVelocity()
            .add(impulseVector.clone().divide(otherMass).multiply(-1));
    }

    private resolvePenetration(
        thisObj: PhysicsObject,
        otherObj: PhysicsObject,
        collisionInfo: CollisionInfo,
    ) {
        if (!collisionInfo.mtv) {
            return;
        }

        let thisNode: Node2D | undefined = this;
        while (thisNode?.getParent()) {
            thisNode = thisNode.getParent();
        }

        if (!thisNode) {
            return;
        }

        let otherNode: Node2D | undefined = otherObj;
        while (otherNode?.getParent()) {
            otherNode = otherNode.getParent();
        }

        if (!otherNode) {
            return;
        }

        const halfMTV = collisionInfo.mtv.clone().divide(2);

        thisObj.position.subtract(halfMTV);

        if (
            !(otherObj instanceof StaticBody) &&
            !(otherObj instanceof CharacterBody)
        ) {
            otherNode.position.add(halfMTV);
        }
    }

    protected _physicsProcess(delta: number): void {
        const movement = this.velocity.clone().multiply(delta);
        this.position.add(movement);
    }
}

export interface RigidBodySettings extends PhysicsObjectSettings {
    momentOfInertia?: number;
}
