import { AABB } from "../aabb";
import { Vector2 } from "../utils/vector";
import { Node2D } from "./node";
import { Shape } from "./shape";

export class CollisionShape extends Node2D {
    private shape: Shape;
    private offset: Vector2 = new Vector2();

    constructor(shape: Shape, name: string = "") {
        super(name);
        this.shape = shape;
    }

    public getShape(): Shape {
        return this.shape;
    }

    public setOffset(x: number, y: number): void {
        this.offset.x = x;
        this.offset.y = y;
    }

    public getOffset(): Vector2 {
        return this.offset.clone();
    }

    public getGlobalShape(): Shape {
        const globalPos = this.getGlobalPosition();
        return this.shape.transformed(globalPos, this.rotation, this.scale);
    }
}
