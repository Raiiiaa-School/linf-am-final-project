import { Texture } from "../utils/texture";
import { Node2D, Node2DSettings } from "./node";

export class Sprite extends Node2D {
    texture: Texture;

    constructor(settings: SpriteSettings) {
        super(settings);
        this.name = settings.name ?? "Sprite";
        this.texture = settings.texture;
    }

    protected _draw(ctx: CanvasRenderingContext2D): void {
        const position = this.getGlobalPosition();
        this.texture.render(ctx);
    }
}

export interface SpriteSettings extends Node2DSettings {
    texture: Texture;
}
