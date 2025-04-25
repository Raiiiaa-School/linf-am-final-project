import { Vector2 } from "../utils/vector2";
import { Node2D, Node2DSettings } from "./node";

export class Camera extends Node2D {
    private offset: Vector2;
    private zoom: Vector2;
    private smoothing: number = 1;
    private viewport: Vector2;
    private active: boolean = false;

    private static activeCamera: Camera | null = null;

    constructor(settings?: Camera2DSettings) {
        super(settings);
        this.offset = settings?.offset ?? new Vector2(0, 0);
        this.zoom = settings?.zoom ?? new Vector2(1, 1);
        this.viewport = new Vector2(
            settings?.viewport?.x ?? 0,
            settings?.viewport?.y ?? 0,
        );
        this.setActive(settings?.active ?? false);
        this.setSmoothing(settings?.smoothing ?? 1);
    }

    public setSmoothing(smoothing: number): void {
        this.smoothing = Math.max(0, Math.min(1, smoothing));
    }

    public setActive(active: boolean): void {
        this.active = active;
        if (active) {
            Camera.setActiveCamera(this);
        } else if (Camera.activeCamera === this) {
            Camera.activeCamera = null;
        }
    }

    public static getActiveCamera(): Camera | null {
        return Camera.activeCamera;
    }

    public static setActiveCamera(camera: Camera): void {
        Camera.activeCamera = camera;
    }

    protected _process(delta: number): void {
        if (!this.parent) {
            return;
        }

        // Calculate the desired position based on parent
        const parentPos = this.parent.getGlobalPosition();
        const currentPos = this.getGlobalPosition();
        const desiredPos = new Vector2(
            parentPos.x + this.offset.x,
            parentPos.y + this.offset.y,
        );

        // Apply smoothing if needed
        if (this.smoothing < 1) {
            const dx = desiredPos.x - currentPos.x;
            const dy = desiredPos.y - currentPos.y;

            this.setGlobalPosition(
                new Vector2(
                    currentPos.x + dx * (1 - this.smoothing),
                    currentPos.y + dy * (1 - this.smoothing),
                ),
            );
        } else {
            this.setGlobalPosition(desiredPos);
        }
    }

    protected _draw(ctx: CanvasRenderingContext2D): void {
        if (!this.active) {
            return;
        }

        // Save the original transform
        ctx.save();

        // Reset the transform to apply camera effects
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        // Get the camera's position
        const cameraPos = this.getGlobalPosition();

        // Center of viewport
        const centerX = this.viewport.x / 2;
        const centerY = this.viewport.y / 2;

        // Apply camera transform
        ctx.translate(centerX, centerY);
        ctx.scale(this.zoom.x, this.zoom.y);
        ctx.translate(-cameraPos.x, -cameraPos.y);

        // Draw the scene from the camera's perspective
        this._drawSceneFromCamera(ctx);

        // Restore original transform
        ctx.restore();
    }

    private _drawSceneFromCamera(ctx: CanvasRenderingContext2D): void {
        // Find the root node
        let rootNode: Node2D = this;
        while (rootNode.getParent()) {
            const node = rootNode.getParent();
            if (node) rootNode = node;
        }

        // Draw everything except the camera and its children
        this._drawNodeExcludingCamera(ctx, rootNode, this);
    }

    private _drawNodeExcludingCamera(
        ctx: CanvasRenderingContext2D,
        node: Node2D,
        camera: Node2D,
    ): void {
        // Skip drawing if this is the camera node
        if (node === camera) {
            return;
        }

        // Draw the current node
        ctx.save();

        ctx.translate(node.position.x, node.position.y);
        ctx.rotate(node.rotation);
        ctx.scale(node.scale.x, node.scale.y);

        if (node.pivot.x !== 0 || node.pivot.y !== 0) {
            ctx.translate(-node.pivot.x, -node.pivot.y);
        }

        // Call the node's drawing method
        (node as any)._draw(ctx);

        // Draw children
        for (const child of (node as any).children) {
            // Skip the camera branch
            if (child !== camera && !this._isChildOfNode(child, camera)) {
                this._drawNodeExcludingCamera(ctx, child, camera);
            }
        }

        ctx.restore();
    }

    private _isChildOfNode(node: Node2D, potentialParent: Node2D): boolean {
        let current = node.getParent();
        while (current) {
            if (current === potentialParent) {
                return true;
            }
            current = current.getParent();
        }
        return false;
    }
}

export interface Camera2DSettings extends Node2DSettings {
    offset?: Vector2;
    zoom?: Vector2;
    smoothing?: number;
    viewport?: Vector2;
    active?: boolean;
}
