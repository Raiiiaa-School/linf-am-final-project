class Vector2D {
    constructor({ x, y } = { x: 0, y: 0 }) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        const magnitude = Math.sqrt(this.x * this.x + this.y * this.y);

        // Avoid dividing by 0
        if (magnitude === 0) {
            return new Vector2D({ x: 0, y: 0 });
        }

        return new Vector2D({ x: this.x / magnitude, y: this.y / magnitude });
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
    }

    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
    }
}
