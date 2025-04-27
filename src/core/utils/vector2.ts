export class Vector2 {
    public x: number;
    public y: number;

    public static ZERO = new Vector2(0, 0);
    public static ONE = new Vector2(1, 1);
    public static UP = new Vector2(0, 1);
    public static DOWN = new Vector2(0, -1);
    public static LEFT = new Vector2(-1, 0);
    public static RIGHT = new Vector2(1, 0);

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public add(other: Vector2): Vector2 {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    public subtract(other: Vector2): Vector2 {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    public multiply(scalar: number): Vector2 {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    public divide(scalar: number): Vector2 {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    public distance(other: Vector2): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalize(): Vector2 {
        const length = this.length();
        return new Vector2(this.x / length, this.y / length);
    }

    public dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    public lerp(position: Vector2, t: number) {
        this.x += (position.x - this.x) * t;
        this.y += (position.y - this.y) * t;
        return this;
    }

    public cross(other: Vector2): number {
        return this.x * other.y - this.y * other.x;
    }

    public angle(other: Vector2): number {
        const dotProduct = this.dot(other);
        const lengthProduct = this.length() * other.length();
        return Math.acos(dotProduct / lengthProduct);
    }

    public distanceSquaredTo(other: Vector2): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx * dx + dy * dy;
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}
