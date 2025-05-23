import { CollisionShape } from "./collision-shape";
import { Node2D, Node2DSettings } from "../node";

export enum CollisionLayer {
    NONE = 0,
    LAYER1 = 1,
    LAYER2 = 2,
    LAYER3 = 4,
    LAYER4 = 8,
    LAYER5 = 16,
    LAYER6 = 32,
    LAYER7 = 64,
    LAYER8 = 128,
    ALL = 255,
}

export abstract class CollisionObject extends Node2D {
    private collisionLayer: CollisionLayer; // Collision layer to be
    private collisionMask: CollisionLayer; // Collision layer to see
    private collisionShape: CollisionShape | undefined;

    constructor(settings?: CollisionObjectSettings) {
        super(settings);
        this.collisionLayer = settings?.collisionLayer ?? CollisionLayer.LAYER1;
        this.collisionMask = settings?.collisionMask ?? CollisionLayer.ALL;
    }

    canCollideWith(other: CollisionObject): boolean {
        return (
            (this.collisionMask & other.collisionLayer) !== 0 &&
            (other.collisionMask & this.collisionLayer) !== 0
        );
    }

    setCollisionShape(shape: CollisionShape) {
        this.collisionShape = shape;
    }

    getCollisionShape(): CollisionShape | undefined {
        if (!this.collisionShape) {
            throw new Error(`CollisionShape not set for ${this.name}`);
        }
        return this.collisionShape;
    }
}

export interface CollisionObjectSettings extends Node2DSettings {
    collisionLayer?: CollisionLayer;
    collisionMask?: CollisionLayer;
}
