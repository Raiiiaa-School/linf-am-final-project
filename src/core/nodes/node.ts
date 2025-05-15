import { Vector2 } from "../utils/vector2";

export class Node2D {
    protected name: string;
    protected children: Node2D[] = [];
    protected searchedNodes: Node2D[] = [];
    protected parent: Node2D | undefined = undefined;
    protected enabled: boolean = true;
    protected grouped: boolean = true;
    private isDestroyed: boolean = false;

    public position: Vector2;
    public rotation: number;
    public scale: Vector2;
    public pivot: Vector2;

    constructor(settings?: Node2DSettings) {
        this.name = settings?.name ?? "Node2D";
        this.enabled = settings?.enabled ?? true;

        this.position = !!settings?.position
            ? settings.position
            : this.parent
              ? this.parent.position
              : new Vector2(0, 0);
        this.rotation = !!settings?.rotation
            ? settings.rotation
            : this.parent
              ? this.parent.rotation
              : 0;

        this.scale = settings?.scale ?? new Vector2(1, 1);
        this.pivot = settings?.pivot ?? new Vector2(0, 0);
    }

    public getGlobalPosition(): Vector2 {
        if (!this.parent) {
            return this.position.clone();
        }

        const globalPos = this.parent.getGlobalPosition();

        if (this.parent.rotation === 0) {
            globalPos.x += this.position.x * this.parent.scale.x;
            globalPos.y += this.position.y * this.parent.scale.y;
        } else {
            const cos = Math.cos(this.parent.rotation);
            const sin = Math.sin(this.parent.rotation);
            const x = this.position.x * this.parent.scale.x;
            const y = this.position.y * this.parent.scale.y;

            globalPos.x += x * cos - y * sin;
            globalPos.y += x * sin + y * cos;
        }

        return globalPos;
    }

    public setGlobalPosition(globalPos: Vector2): void {
        if (!this.parent) {
            this.position = globalPos.clone();
            return;
        }

        const parentGlobalPos = this.parent.getGlobalPosition();
        const localX = globalPos.x - parentGlobalPos.x;
        const localY = globalPos.y - parentGlobalPos.y;

        if (this.parent.rotation === 0) {
            this.position.x = localX / this.parent.scale.x;
            this.position.y = localY / this.parent.scale.y;
        } else {
            const cos = Math.cos(-this.parent.rotation);
            const sin = Math.sin(-this.parent.rotation);
            const x = localX;
            const y = localY;

            this.position.x = (x * cos - y * sin) / this.parent.scale.x;
            this.position.y = (x * sin + y * cos) / this.parent.scale.y;
        }
    }

    public getParent(): Node2D | undefined {
        return this.parent;
    }

    public getNode<T extends Node2D = Node2D>(name: string): T | undefined {
        if (this.name === name) {
            return this as any;
        }

        if (this.parent) {
            return this.parent.getNode(name);
        }
        return this.searchNode(name);
    }

    public getName(): string {
        return this.name;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    private searchNode<T extends Node2D = Node2D>(name: string): T | undefined {
        if (this.name === name) {
            return this as any;
        }

        const node = this.searchedNodes.find((node) => node.name === name);

        if (node) {
            return node as any;
        }

        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const found = child.searchNode(name);
            if (found) {
                this.searchedNodes.push(found);
                return found as any;
            }
        }

        console.error(`Node "${name}" not found!`);
    }

    public addChild(child: Node2D): Node2D {
        this.children.push(child);
        child.parent = this;
        child._init();
        return this;
    }

    public removeChild(child: Node2D): void {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = undefined;
        }
    }

    public removeAllChildren(): void {
        this.children.forEach((child) => (child.parent = undefined));
        this.children = [];
    }

    public remove(): void {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public initialize(): void {
        if (!this.enabled) {
            return;
        }

        this._init();
        this.children.forEach((child) => {
            if (!child.enabled) {
                return;
            }
            child._init();
        });

        this._ready();
        this.children.forEach((child) => {
            if (!child.enabled) {
                return;
            }
            child._ready();
        });
    }

    public update(delta: number): void {
        if (!this.enabled) {
            return;
        }
        this._process(delta);
        this.children.forEach((child) => {
            if (!child.enabled) {
                return;
            }
            child.update(delta);
        });
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.enabled) {
            return;
        }

        ctx.save();

        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        if (this.pivot.x !== 0 || this.pivot.y !== 0) {
            ctx.translate(-this.pivot.x, -this.pivot.y);
        }

        this._draw(ctx);

        this.children.forEach((child) => {
            if (!child.enabled) {
                return;
            }
            child.draw(ctx);
        });

        ctx.restore();
    }

    public queueDestroy(): void {
        if (this.isDestroyed) return;
        this.parent?.removeChild(this);
        this._destroy();
    }

    protected _init(): void {}
    protected _ready(): void {}
    protected _process(delta: number): void {}
    protected _draw(ctx: CanvasRenderingContext2D): void {}
    protected _destroy(): void {}
}

export interface Node2DSettings {
    name?: string;
    enabled?: boolean;

    position?: Vector2;
    rotation?: number;
    scale?: Vector2;
    pivot?: Vector2;
}
