export class Vector2 {
    public x: number;
    public y: number;

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

    public multiply(scalar: number | Vector2): Vector2 {
        if (scalar instanceof Vector2) {
            this.x *= scalar.x;
            this.y *= scalar.y;
            return this;
        }
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    public divide(scalar: number): Vector2 {
        if (scalar === 0) {
            console.error("Can't divide by 0");
            return this;
        }
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public normalize(): Vector2 {
        const mag = this.magnitude();
        if (mag === 0) {
            return new Vector2();
        }
        return this.divide(mag);
    }

    public dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    public rotate(radians: number): Vector2 {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public static distance(a: Vector2, b: Vector2): number {
        return a.subtract(b).magnitude();
    }
}
