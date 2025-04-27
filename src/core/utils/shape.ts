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

export interface Shape {
    checkPoint(point: Vector2): boolean;
    checkCollision(
        other: Shape,
        transform1: Transform,
        transform2: Transform,
    ): boolean;
    getBounds(transform: Transform): Bounds;
}

export class RectangleShape implements Shape {
    public width: number;
    public height: number;

    constructor(width: number = 10, height: number = 10) {
        this.width = width;
        this.height = height;
    }

    checkPoint(point: Vector2): boolean {
        return (
            point.x >= -this.width / 2 &&
            point.x <= this.width / 2 &&
            point.y >= -this.height / 2 &&
            point.y <= this.height / 2
        );
    }

    checkCollision(
        other: Shape,
        transform1: Transform,
        transform2: Transform,
    ): boolean {
        if (other instanceof RectangleShape) {
            return this.testRectangle(other, transform1, transform2);
        } else if (other instanceof CircleShape) {
            return other.testRectangle(this, transform1, transform2);
        }
        return false;
    }

    getBounds(transform: Transform): Bounds {
        const halfWidth = (this.width * transform.scale.x) / 2;
        const halfHeight = (this.height * transform.scale.y) / 2;

        if (transform.rotation === 0) {
            return {
                min: new Vector2(
                    transform.position.x - halfWidth,
                    transform.position.y - halfHeight,
                ),
                max: new Vector2(
                    transform.position.x + halfWidth,
                    transform.position.y + halfHeight,
                ),
            };
        }

        // Rotated
        const corners = [
            new Vector2(-halfWidth, -halfHeight),
            new Vector2(halfWidth, -halfHeight),
            new Vector2(halfWidth, halfHeight),
            new Vector2(-halfWidth, halfHeight),
        ];

        const transformedCorners = corners.map((corner) => {
            const rotated = new Vector2(
                corner.x * Math.cos(transform.rotation) -
                    corner.y * Math.sin(transform.rotation),
                corner.x * Math.sin(transform.rotation) +
                    corner.y * Math.cos(transform.rotation),
            );

            return rotated.add(transform.position);
        });

        const minX = Math.min(...transformedCorners.map((c) => c.x));
        const minY = Math.min(...transformedCorners.map((c) => c.y));
        const maxX = Math.max(...transformedCorners.map((c) => c.x));
        const maxY = Math.max(...transformedCorners.map((c) => c.y));

        return {
            min: new Vector2(minX, minY),
            max: new Vector2(maxX, maxY),
        };
    }

    testRectangle(
        other: RectangleShape,
        transform1: Transform,
        transform2: Transform,
    ): boolean {
        const bounds1 = this.getBounds(transform1);
        const bounds2 = other.getBounds(transform2);

        return (
            bounds1.min.x < bounds2.max.x &&
            bounds1.max.x > bounds2.min.x &&
            bounds1.min.y < bounds2.max.y &&
            bounds1.max.y > bounds2.min.y
        );
    }

    getCollisionInfo(
        other: RectangleShape,
        transform1: Transform,
        transform2: Transform,
    ): { normal: Vector2; depth: number } | null {
        if (!this.testRectangle(other, transform1, transform2)) {
            return null;
        }

        const bounds1 = this.getBounds(transform1);
        const bounds2 = other.getBounds(transform2);

        // Calculate overlap on each axis
        const overlapX = Math.min(
            bounds1.max.x - bounds2.min.x,
            bounds2.max.x - bounds1.min.x,
        );
        const overlapY = Math.min(
            bounds1.max.y - bounds2.min.y,
            bounds2.max.y - bounds1.min.y,
        );

        // Use the smallest overlap to determine collision normal
        if (overlapX < overlapY) {
            const direction = bounds1.min.x < bounds2.min.x ? -1 : 1;
            return {
                normal: new Vector2(direction, 0),
                depth: overlapX,
            };
        } else {
            const direction = bounds1.min.y < bounds2.min.y ? -1 : 1;
            return {
                normal: new Vector2(0, direction),
                depth: overlapY,
            };
        }
    }
}

export class CircleShape implements Shape {
    public radius: number;

    constructor(radius: number = 5) {
        this.radius = radius;
    }

    checkPoint(point: Vector2): boolean {
        return point.length() <= this.radius;
    }

    checkCollision(
        other: Shape,
        transform1: Transform,
        transform2: Transform,
    ): boolean {
        if (other instanceof CircleShape) {
            return this.testCircle(other, transform1, transform2);
        } else if (other instanceof RectangleShape) {
            return this.testRectangle(other, transform1, transform2);
        }
        return false;
    }

    getBounds(transform: Transform): Bounds {
        const scaledRadius =
            this.radius * Math.max(transform.scale.x, transform.scale.y);
        return {
            min: new Vector2(
                transform.position.x - scaledRadius,
                transform.position.y - scaledRadius,
            ),
            max: new Vector2(
                transform.position.x + scaledRadius,
                transform.position.y + scaledRadius,
            ),
        };
    }

    testCircle(
        other: CircleShape,
        transform1: Transform,
        transform2: Transform,
    ): boolean {
        const radius1 =
            this.radius * Math.max(transform1.scale.x, transform1.scale.y);
        const radius2 =
            other.radius * Math.max(transform2.scale.x, transform2.scale.y);

        const distanceSquared = transform1.position.distanceSquaredTo(
            transform2.position,
        );
        const combinedRadius = radius1 + radius2;

        return distanceSquared <= combinedRadius * combinedRadius;
    }

    testRectangle(
        rect: RectangleShape,
        circleTransform: Transform,
        rectTransform: Transform,
    ): boolean {
        const circleCenter = circleTransform.position;
        const rectCenter = rectTransform.position;

        const deltaPos = circleCenter.subtract(rectCenter);

        const rotatedDelta = new Vector2(
            deltaPos.x * Math.cos(-rectTransform.rotation) -
                deltaPos.y * Math.sin(-rectTransform.rotation),
            deltaPos.x * Math.sin(-rectTransform.rotation) +
                deltaPos.y * Math.cos(-rectTransform.rotation),
        );

        const scaledDelta = new Vector2(
            rotatedDelta.x / rectTransform.scale.x,
            rotatedDelta.y / rectTransform.scale.y,
        );

        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;

        const closestX = Math.max(
            -halfWidth,
            Math.min(halfWidth, scaledDelta.x),
        );
        const closestY = Math.max(
            -halfHeight,
            Math.min(halfHeight, scaledDelta.y),
        );

        const closestPoint = new Vector2(closestX, closestY);
        const distance = scaledDelta.subtract(closestPoint).length();

        const circleRadius =
            this.radius *
            Math.max(circleTransform.scale.x, circleTransform.scale.y);

        return distance <= circleRadius;
    }
}
