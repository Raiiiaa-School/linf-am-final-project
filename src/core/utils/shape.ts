import { Vector2 } from "./vector2";

export interface Bounds {
    min: Vector2;
    max: Vector2;
}

export interface Transform {
    position: Vector2;
    rotation: number;
    scale: Vector2;
}

export interface Shaper {
    getAxes(): Vector2[];
    projectShape(transform: Transform, axis: Vector2): [number, number];
}

export class Shape implements Shaper {
    private vertices: Vector2[] = [];

    private constructor(vertices: Vector2[]) {
        this.vertices = vertices;
    }

    public static Rectangle(width: number, height: number): Shape {
        const size = new Vector2(width, height);
        const halfSize = size.multiply(0.5);

        // Define the base vertices
        const vertices = [
            new Vector2(-halfSize.x, -halfSize.y),
            new Vector2(halfSize.x, -halfSize.y),
            new Vector2(halfSize.x, halfSize.y),
            new Vector2(-halfSize.x, halfSize.y),
        ];

        return new Shape(vertices);
    }

    public applyTransform(transform: Transform) {
        this.vertices = this.vertices.map((vertex) =>
            this.transformVertex(vertex, transform.scale, transform.rotation),
        );
    }

    private transformVertex(
        vertex: Vector2,
        scale: Vector2,
        rotation: number,
    ): Vector2 {
        // Apply scale
        const scaled = new Vector2(vertex.x * scale.x, vertex.y * scale.y);

        // Apply rotation
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);

        return new Vector2(
            scaled.x * cos - scaled.y * sin,
            scaled.x * sin + scaled.y * cos,
        );
    }

    public getVertices(): Vector2[] {
        return this.vertices;
    }

    public getAxes(): Vector2[] {
        const axes: Vector2[] = [];

        for (let i = 0; i < this.vertices.length; i++) {
            const current = this.vertices[i];
            const next = this.vertices[(i + 1) % this.vertices.length];

            const edge = new Vector2(next.x - current.x, next.y - current.y);
            const axis = new Vector2(-edge.y, edge.x).normalize();
            axes.push(axis);
        }
        return axes;
    }

    projectShape(transform: Transform, axis: Vector2): [number, number] {
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;

        for (let i = 0; i < this.vertices.length; i++) {
            const vertex = this.vertices[i];
            const worldVertex = new Vector2(
                vertex.x + transform.position.x,
                vertex.y + transform.position.y,
            );
            const projection = worldVertex.dot(axis);
            min = Math.min(min, projection);
            max = Math.max(max, projection);
        }

        return [min, max];
    }
}
