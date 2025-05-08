import { CropOptions, SpriteSheetCropOptions } from "./animation";
import { Color } from "./color";
import { Vector2 } from "./vector2";

export class Texture {
    private image: HTMLImageElement | undefined;
    private color: Color | undefined;
    private cropOptions: CropOptions | undefined;
    private width: number = 0;
    private height: number = 0;
    private loaded: boolean = false;
    private flip = Vector2.ONE;

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

        const start = options.start ?? 0;
        const end = options.end ?? options.frameCount - 1;
        let animationFrameCount = end - start;

        for (let i = 0; i < animationFrameCount + 1; i++) {
            const texture = new Texture();
            const image = new Image();

            image.onload = () => {
                texture.width = options.size?.x ?? image.width;
                texture.height = options.size?.y ?? image.height;
                texture.image = image;
                texture.loaded = true;

                texture.cropOptions = {
                    x:
                        Math.floor(image.width / options.frameCount) *
                            (i + start) +
                        (options.offset ? -options.offset.x : 0),
                    y: 0 + (options.offset ? -options.offset.y : 0),
                    w: image.width / options.frameCount,
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

    flipHorizontal(reset: boolean = false) {
        this.flip.x = -1;
        if (reset) {
            this.flip.y = 1;
        }
    }

    flipVertical(reset: boolean = false) {
        this.flip.y = -1;
        if (reset) {
            this.flip.x = 1;
        }
    }

    render(ctx: CanvasRenderingContext2D) {
        if (!this.loaded) return;

        ctx.save();
        ctx.scale(this.flip.x, this.flip.y);

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
        ctx.restore();
    }
}
