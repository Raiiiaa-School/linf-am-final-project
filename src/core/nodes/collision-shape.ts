import { DEBUG_COLORS } from "../constants/colors";
import { Shape, Transform } from "../utils/shape";
import { Texture } from "../utils/texture";
import { Vector2 } from "../utils/vector2";
import { CollisionObject } from "./collision-object";
import { Node2D, Node2DSettings } from "./node";

export class CollisionShape extends Node2D {
    private shape: Shape;
    private debug: boolean;
    private debugTexture: Texture;

    constructor(settings: CollisionShapeSettings) {
        super(settings);
        this.name = settings?.name ?? "CollisionShape";
        this.shape = settings.shape;
        this.debug = settings.debug ?? true;

        if (settings.debugTexture) {
            this.debugTexture = settings.debugTexture;
        } else {
            const transform = this.getTransform();
            const bounds = this.shape.getBounds(transform);
            const x = bounds.max.x - bounds.min.x;
            const y = bounds.max.y - bounds.min.y;
            this.debugTexture = Texture.fromColor(DEBUG_COLORS.BLUE, x, y);
        }
    }

    protected _init(): void {
        if (this.parent instanceof CollisionObject) {
            this.parent.setCollisionShape(this);
        }
    }

    public getShape(): Shape {
        return this.shape;
    }

    public setShape(shape: Shape): void {
        this.shape = shape;
    }

    public getTransform(): Transform {
        const transform = {
            position: this.getGlobalPosition(),
            rotation: this.rotation,
            scale: this.scale,
        };
        return transform;
    }

    public checkCollision(other: CollisionShape): boolean {
        const thisTransform = this.getTransform();
        const otherTransform = other.getTransform();
        return this.shape.checkCollision(
            other.shape,
            thisTransform,
            otherTransform,
        );
    }

    public containsPoint(point: Vector2): boolean {
        const globalPos = this.getGlobalPosition();
        const localPoint = new Vector2(
            point.x - globalPos.x,
            point.y - globalPos.y,
        );

        const rotatedPoint = new Vector2(
            localPoint.x * Math.cos(this.rotation) -
                localPoint.y * Math.sin(this.rotation),
            localPoint.x * Math.sin(this.rotation) +
                localPoint.y * Math.cos(this.rotation),
        );

        const scaledPoint = new Vector2(
            rotatedPoint.x / this.scale.x,
            rotatedPoint.y / this.scale.y,
        );

        return this.shape.checkPoint(scaledPoint);
    }

    protected _draw(ctx: CanvasRenderingContext2D): void {
        if (!this.debug) {
            return;
        }

        this.debugTexture.render(ctx, 0, 0);
    }
}

export interface CollisionShapeSettings extends Node2DSettings {
    shape: Shape;
    debug?: boolean;
    debugTexture?: Texture;
}
