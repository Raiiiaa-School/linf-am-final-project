import { CollisionInfo } from "../../utils/collision";
import { PhysicsObject, PhysicsObjectSettings } from "./physics-object";
import { Vector2 } from "../../utils/vector2";
import { RigidBody } from "./rigidbody";
import { Node2D } from "../node";

export class CharacterBody extends PhysicsObject {
    constructor(settings?: CharacterBodySettings) {
        super(settings);
        this.name = settings?.name ?? "CharacterBody";
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
    ) {
        if (!collisionInfo.mtv) {
            return;
        }

        this.resolvePenetration(this, other, collisionInfo);
    }

    protected moveAndSlide(deltaTime: number) {
        this.move(deltaTime);
    }

    protected move(deltaTime: number) {
        this.position.add(this.velocity.multiply(deltaTime));
    }

    private resolvePenetration(
        thisObj: PhysicsObject,
        otherObj: PhysicsObject,
        collisionInfo: CollisionInfo,
    ) {
        if (!collisionInfo.mtv) {
            return;
        }

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

        this.position.subtract(collisionInfo.mtv);

        if (this.isOnFloor()) {
            this.velocity.y = 0;
        }
    }
}

export interface CharacterBodySettings extends PhysicsObjectSettings {}
