export class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    public subtract(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    public multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    public divide(scalar: number): Vector2 {
        return new Vector2(this.x / scalar, this.y / scalar);
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

    public cross(other: Vector2): number {
        return this.x * other.y - this.y * other.x;
    }

    public angle(other: Vector2): number {
        const dotProduct = this.dot(other);
        const lengthProduct = this.length() * other.length();
        return Math.acos(dotProduct / lengthProduct);
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }
}
