import { Area2D } from "./nodes/area";
import { Node, Node2D } from "./nodes/node";
import { PhysicsObject } from "./nodes/physics-object";
import { PhysicsEngine } from "./physics-engine";

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private rootNode: Node = new Node2D("root");
    private physicsEngine: PhysicsEngine = new PhysicsEngine();
    private lastTime: number = 0;
    private running: boolean = false;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
    }

    public start(): void {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    public stop(): void {
        this.running = false;
    }

    public addNode(node: Node): void {
        this.rootNode.addChild(node);

        if (node instanceof PhysicsObject) {
            this.physicsEngine.addPhysicsObject(node);
        }

        if (node instanceof Area2D) {
            this.physicsEngine.addArea(node);
        }
    }

    public removeNode(node: Node): void {
        this.rootNode.removeChild(node);

        if (node instanceof PhysicsObject) {
            this.physicsEngine.removePhysicsObject(node);
        }

        if (node instanceof Area2D) {
            this.physicsEngine.removeArea(node);
        }
    }

    private gameLoop(timestamp: number): void {
        if (!this.running) {
            return;
        }

        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.physicsEngine.update(deltaTime);
        this.rootNode.update(deltaTime);

        this.rootNode.draw(this.ctx);

        requestAnimationFrame(this.gameLoop.bind(this));
    }
}
