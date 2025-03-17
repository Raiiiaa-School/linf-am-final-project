import { Frame } from "../utils/frame";
import { Node2D } from "./node";

export class AnimatedSprite extends Node2D {
    private animations: Map<string, Frame[]> = new Map();
    private currentAnimation: string = "";
    private currentFrame: number = 0;
    private frameTimer: number = 0;
    private playing: boolean = false;
    private loop: boolean = true;
    private width: number = 0;
    private height: number = 0;
    private onAnimationFinished: ((animationName: string) => void) | undefined;

    constructor(name: string = "") {
        super(name);
    }

    public addAnimation(name: string, frames: Frame[]): AnimatedSprite {
        this.animations.set(name, frames);

        if (this.width === 0 && frames.length > 0) {
            this.width = frames[0].image.width;
            this.height = frames[0].image.height;
        }
        return this;
    }

    public play(animationName: string, loop: boolean = true): void {
        if (!this.animations.has(animationName)) {
            console.warn(
                `Animation "${animationName}" not found on node "${this.name}"`
            );
        }

        if (this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }

        this.loop = loop;
        this.playing = true;
    }

    public stop() {
        this.playing = false;
    }

    public setOnAnimationFinished(
        callback: (animationName: string) => void
    ): AnimatedSprite {
        this.onAnimationFinished = callback;
        return this;
    }

    protected _process(deltaTime: number): void {
        if (!this.playing || !this.currentAnimation) {
            return;
        }

        const frames = this.animations.get(this.currentAnimation);
        if (!frames || frames.length === 0) {
            return;
        }

        this.frameTimer += deltaTime;
        const frameDuration = frames[this.currentFrame].duration;

        if (this.frameTimer >= frameDuration) {
            this.frameTimer -= frameDuration;
            this.currentFrame++;

            if (this.currentFrame >= frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = frames.length - 1;
                    this.playing = false;

                    if (this.onAnimationFinished) {
                        this.onAnimationFinished(this.currentAnimation);
                    }
                }
            }
        }
    }

    protected _draw(ctx: CanvasRenderingContext2D): void {
        if (!this.currentAnimation) {
            return;
        }

        const frames = this.animations.get(this.currentAnimation);
        if (!frames || frames.length === 0) {
            return;
        }

        const frame = frames[this.currentFrame];
        if (!frame) {
            return;
        }

        ctx.drawImage(
            frame.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
    }
}
