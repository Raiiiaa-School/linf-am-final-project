import { Vector2 } from "./utils/vector";

export class AABB {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public intersects(other: AABB): boolean {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    }

    public getCenter(): Vector2 {
        return new Vector2(this.x + this.width / 2, this.y + this.height / 2);
    }

    public getGap(other: AABB, velocity: Vector2): number {
        const normalized = velocity.normalize();

        const thisCenter = this.getCenter();
        const otherCenter = other.getCenter();
        const centerDistance = Vector2.distance(thisCenter, otherCenter);

        const thisHalfExtent =
            (this.width * Math.abs(normalized.x)) / 2 +
            (this.height * Math.abs(normalized.y)) / 2;
        const otherHalfExtent =
            (other.width * Math.abs(normalized.x)) / 2 +
            (other.height * Math.abs(normalized.y)) / 2;

        return centerDistance - thisHalfExtent - otherHalfExtent;
    }
}
