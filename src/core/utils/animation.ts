import { Texture } from "./texture";
import { Vector2 } from "./vector2";

export interface SpriteAnimation {
    name: string;
    frames?: Texture[];
    frameCount?: number;
    speed: number;
    loop: boolean;
    default?: boolean;
    offset?: Vector2;
    image?: Texture;
}

export interface SpriteSheetCropOptions {
    frameCount: number;
    size?: Vector2;
    offset?: Vector2;
    start?: number;
    end?: number;
}

export interface CropOptions {
    x: number;
    y: number;
    w: number;
    h: number;
}
