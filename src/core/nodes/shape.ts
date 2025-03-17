import { AABB } from "../aabb";
import { Vector2 } from "../utils/vector";

export abstract class Shape {
    abstract getAABB(): AABB;
    abstract transformed(
        position: Vector2,
        rotation: number,
        scale: Vector2
    ): Shape;
    abstract intersects(other: Shape): boolean;
}

export class RetangleShape extends Shape {
    private width: number;
    private height: number;

    constructor(width: number, height: number) {
        super();
        this.width = width;
        this.height = height;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getAABB(): AABB {
        return new AABB(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
    }

    public transformed(
        position: Vector2,
        rotation: number,
        scale: Vector2
    ): Shape {
        const rect = new RetangleShape(
            this.width * scale.x,
            this.height * scale.y
        );
        return rect;
    }

    public intersects(other: Shape): boolean {
        if (other instanceof RetangleShape) {
            const thisAABB = this.getAABB();
            const otherAABB = other.getAABB();
            return thisAABB.intersects(otherAABB);
        }
        return false;
    }
}

export class CircleShape extends Shape {
    private radius: number;

    constructor(radius: number) {
        super();
        this.radius = radius;
    }

    public getRadius(): number {
        return this.radius;
    }

    public getAABB(): AABB {
        return new AABB(
            -this.radius,
            -this.radius,
            this.radius * 2,
            this.radius * 2
        );
    }

    public transformed(
        position: Vector2,
        rotation: number,
        scale: Vector2
    ): Shape {
        const avgScale = (scale.x + scale.y) / 2;
        return new CircleShape(this.radius * avgScale);
    }

    public intersects(other: Shape): boolean {
        if (other instanceof CircleShape) {
            return false;
        }
        return false;
    }
}
