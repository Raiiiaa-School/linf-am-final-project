import { Vector2 } from "../utils/vector";

export abstract class Node {
    protected children: Node[] = [];
    protected parent: Node | undefined = undefined;
    protected position: Vector2 = new Vector2();
    protected rotation: number = 0;
    protected scale: Vector2 = new Vector2(1, 1);
    public name: string = "";

    constructor(name: string = "") {
        this.name = name;
    }

    public addChild(child: Node): Node {
        this.children.push(child);
        child.parent = this;
        return this;
    }

    public removeChild(child: Node): Node {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = undefined;
        }
        return this;
    }

    public setPosition(x: number, y: number): Node {
        this.position.x = x;
        this.position.y = y;
        return this;
    }

    public setRotation(radians: number): Node {
        this.rotation = this.rotation;
        return this;
    }

    public setScale(x: number, y: number): Node {
        this.scale.x = x;
        this.scale.y = y;
        return this;
    }

    public getGlobalPosition(): Vector2 {
        let globalPos = this.position.clone();
        let currentNode = this.parent;

        while (currentNode) {
            globalPos = globalPos
                .rotate(currentNode.rotation)
                .multiply(currentNode.scale)
                .add(currentNode.position);
            currentNode = currentNode.parent;
        }

        return globalPos;
    }

    public update(deltaTime: number): void {
        this._process(deltaTime);
        this.children.forEach((child) => child.update(deltaTime));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        this._draw(ctx);

        this.children.forEach((child) => child.draw(ctx));

        ctx.restore();
    }

    protected _process(deltaTime: number): void {}
    protected _draw(ctx: CanvasRenderingContext2D): void {}
}

export class Node2D extends Node {
    constructor(name: string = "") {
        super(name);
    }
}
