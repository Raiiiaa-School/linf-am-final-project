import { DEBUG_COLORS } from "../../constants/colors";
import { Shape, Transform } from "../../utils/shape";
import { Texture } from "../../utils/texture";
import { Vector2 } from "../../utils/vector2";
import { CollisionObject } from "./collision-object";
import { Node2D, Node2DSettings } from "../node";
import { CollisionInfo } from "../../utils/collision";
import { PhysicsObject } from "./physics-object";

export class CollisionShape extends Node2D {
    private shape: Shape;
    private debug: boolean;

    constructor(settings: CollisionShapeSettings) {
        super(settings);
        this.name = settings?.name ?? "CollisionShape";
        this.shape = settings.shape;
        this.debug = settings.debug ?? false;
    }

    protected _init(): void {
        if (this.parent instanceof CollisionObject) {
            this.parent.setCollisionShape(this);
        }

        this.shape.applyTransform(this.getTransform());
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

    public checkCollision(other: CollisionShape): CollisionInfo {
        const axes = [...this.shape.getAxes(), ...other.shape.getAxes()];

        let smallestOverlap = Number.POSITIVE_INFINITY;
        let smallestAxis: Vector2 | undefined;

        for (const axis of axes) {
            const [minA, maxA] = this.shape.projectShape(
                this.getTransform(),
                axis,
            );
            const [minB, maxB] = other.shape.projectShape(
                other.getTransform(),
                axis,
            );

            if (maxA < minB || maxB < minA) {
                return { colliding: false };
            }

            const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);
            if (overlap < smallestOverlap) {
                smallestOverlap = overlap;
                smallestAxis = axis;
            }
        }

        return {
            colliding: true,
            mtv: smallestAxis?.multiply(smallestOverlap),
            overlap: smallestOverlap,
        };
    }

    public checkPoint(point: Vector2, transform: Transform): boolean {
        let inside = false;
        const vertices = this.shape.getVertices();
        const numVertices = vertices.length;

        // We need the vertices in world space
        const worldVertices = this.shape
            .getVertices()
            .map(
                (vertex) =>
                    new Vector2(
                        vertex.x + transform.position.x,
                        vertex.y + transform.position.y,
                    ),
            );

        for (let i = 0, j = numVertices - 1; i < numVertices; j = i++) {
            const vert1 = vertices[i];
            const vert2 = vertices[j];

            const intersect =
                vert1.y > point.y !== vert2.y > point.y &&
                point.x <
                    ((vert2.x - vert1.x) * (point.y - vert1.y)) /
                        (vert2.y - vert1.y) +
                        vert1.x;

            if (intersect) {
                inside = true;
                return inside;
            }
        }

        return inside;
    }

    protected _draw(ctx: CanvasRenderingContext2D): void {
        if (!this.debug) {
            return;
        }

        const transform = this.getTransform();
        const { r, g, b, a } = DEBUG_COLORS.BLUE;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${1})`;
        ctx.lineWidth = 2;

        const vertices = this.shape.getVertices();

        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = `red`;
        vertices.forEach((vertex) => {
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 3, 0, Math.PI * 2);
            ctx.fill();
        });

        const axes = this.shape.getAxes();
        ctx.strokeStyle = "rgba(0, 0, 255, 0.5)";
        ctx.lineWidth = 1;

        vertices.forEach((vertex, index) => {
            const axis = axes[index];
            const axisLength = 30;

            ctx.beginPath();
            ctx.moveTo(vertex.x, vertex.y);
            ctx.lineTo(
                vertex.x + axis.x * axisLength,
                vertex.y + axis.y * axisLength,
            );
            ctx.stroke();
        });

        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(transform.position.x, transform.position.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw ground state
        if (this.parent instanceof PhysicsObject) {
            if (this.parent.isOnFloor()) {
                ctx.fillStyle = "green";
                ctx.fillText("GROUNDED", this.position.x, this.position.y - 50);
            }

            // Draw velocity vector
            ctx.strokeStyle = "blue";
            ctx.beginPath();
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(
                this.parent.getVelocity().x * 0.1,
                this.parent.getVelocity().y * 0.1,
            );
            ctx.stroke();
        }
    }
}

export interface CollisionShapeSettings extends Node2DSettings {
    shape: Shape;
    debug?: boolean;
    debugTexture?: Texture;
}
