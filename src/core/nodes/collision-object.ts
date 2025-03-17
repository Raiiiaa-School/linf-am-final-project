import { CollisionShape } from "./collision-shape";
import { Node2D } from "./node";

export abstract class CollisionObject extends Node2D {
    protected collisionShapes: CollisionShape[] = [];
    protected collisionLayer: number = 1;
    protected collisionMask: number = 1;

    constructor(name: string = "") {
        super(name);
    }

    public addCollisionShape(shape: CollisionShape): CollisionObject {
        this.collisionShapes.push(shape);
        this.addChild(shape);
        return this;
    }

    public removeCollisionShape(shape: CollisionShape): CollisionObject {
        const index = this.collisionShapes.indexOf(shape);
        if (index !== -1) {
            this.collisionShapes.splice(index, 1);
            this.removeChild(shape);
        }
        return this;
    }

    public setCollisionLayer(layer: number): CollisionObject {
        this.collisionLayer = layer;
        return this;
    }

    public setCollisionMask(mask: number): CollisionObject {
        this.collisionMask = mask;
        return this;
    }

    public getCollisionShapes(): CollisionShape[] {
        return this.collisionShapes;
    }

    public canCollideWith(other: CollisionObject): boolean {
        return (
            (this.collisionLayer & other.collisionMask) !== 0 ||
            (other.collisionLayer & this.collisionMask) !== 0
        );
    }

    public _process(deltaTime: number): void {
        // Collision detection will be handled by the physics engine
    }
}
