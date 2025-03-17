import { Node2D } from "./node";

export class Sprite extends Node2D {
    private image: HTMLImageElement | undefined = undefined;
    private color: string = "";
    private width: number = 0;
    private height: number = 0;

    constructor(name: string = "") {
        super(name);
    }

    public setImage(image: HTMLImageElement): Sprite {
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.color = "";
        return this;
    }

    public setColor(color: string, width: number, height: number): Sprite {
        this.color = color;
        this.width = width;
        this.height = height;
        this.image = undefined;
        return this;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    protected _draw(ctx: CanvasRenderingContext2D): void {
        if (this.image) {
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height - 2,
                this.width,
                this.height
            );
        } else if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
        }

        // console.log(`"${this.name}" is getting draw at `, this.position);
    }
}
