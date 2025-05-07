import { CropOptions, SpriteSheetCropOptions } from "./animation";
import { Color } from "./color";

export class Texture {
    private image: HTMLImageElement | undefined;
    private color: Color | undefined;
    private cropOptions: CropOptions | undefined;
    private width: number = 0;
    private height: number = 0;
    private loaded: boolean = false;

    static fromImage(url: URL, width?: number, height?: number): Texture {
        const texture = new Texture();
        const image = new Image();

        image.onload = () => {
            texture.width = width ?? image.width;
            texture.height = height ?? image.height;
            texture.image = image;
            texture.loaded = true;
        };
        image.src = url.toString();
        return texture;
    }

    static fromSpriteSheet(
        url: URL,
        options: SpriteSheetCropOptions,
    ): Texture[] {
        const textures: Texture[] = [];
        for (let i = 0; i < options.frameCount; i++) {
            const texture = new Texture();
            const image = new Image();

            image.onload = () => {
                texture.width = options.size?.x ?? image.width;
                texture.height = options.size?.y ?? image.height;
                texture.image = image;
                texture.loaded = true;

                texture.cropOptions = {
                    x: Math.floor(image.width / 6) * i,
                    y: 0,
                    w: image.width / 6,
                    h: image.height,
                };
            };
            image.src = url.toString();
            textures.push(texture);
        }
        return textures;
    }

    static fromColor(color: Color, width: number, height: number): Texture {
        const texture = new Texture();
        texture.color = color;
        texture.width = width;
        texture.height = height;
        texture.loaded = true;
        return texture;
    }

    public isLoaded(): boolean {
        return this.loaded;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getImage(): HTMLImageElement | undefined {
        return this.image;
    }

    getColor(): Color | undefined {
        return this.color;
    }

    setCropOptions(options: CropOptions) {
        this.cropOptions = options;
    }

    clone() {
        const clone = new Texture();
        clone.image = this.image;
        clone.color = this.color;
        clone.width = this.width;
        clone.height = this.height;
        clone.loaded = this.loaded;
        return clone;
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.loaded) return;

        if (this.image) {
            if (this.cropOptions) {
                ctx.drawImage(
                    this.image,
                    this.cropOptions.x,
                    this.cropOptions.y,
                    this.cropOptions.w,
                    this.cropOptions.h,
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height,
                );
            } else {
                ctx.drawImage(
                    this.image,
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height,
                );
            }
        } else if (this.color) {
            const previousFillStyle = ctx.fillStyle;
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
            ctx.fillRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height,
            );
            ctx.fillStyle = previousFillStyle;
        }
    }
}
