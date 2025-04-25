import { Color } from "./color";

export class Texture {
    private image: CanvasImageSource | undefined;
    private color: Color | undefined;
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
        image.src = url.pathname;
        return texture;
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

    getSource(): CanvasImageSource | undefined {
        return this.image;
    }

    getColor(): Color | undefined {
        return this.color;
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number) {
        if (!this.loaded) return;

        if (this.image) {
            ctx.drawImage(this.image, x, y, this.width, this.height);
        } else if (this.color) {
            const previousFillStyle = ctx.fillStyle;
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
            ctx.fillRect(x, y, this.width, this.height);
            ctx.fillStyle = previousFillStyle;
        }
    }
}
