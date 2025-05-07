import { Signal, Texture } from "../utils";
import { SpriteAnimation } from "../utils/animation";
import { Node2D, Node2DSettings } from "./node";

export class AnimatedSprite extends Node2D {
    private animations: Map<string, SpriteAnimation> = new Map();
    private currentAnimation?: SpriteAnimation;
    private currentFrameIndex: number = 0;
    private frameAccumulator: number = 0;
    private playing: boolean = false;

    public onAnimationChange = new Signal<SpriteAnimation>();

    constructor(settings?: AnimatedSpriteSettings) {
        super(settings);

        this.name = settings?.name ?? "AnimatedSprite";
    }

    public addAnimation(animation: SpriteAnimation, auto: boolean = false) {
        if (this.animations.has(animation.name)) {
            console.warn(
                `Animation "${animation.name}" already exists. Overwriting`,
            );
        }
        this.animations.set(animation.name, animation);

        if (animation.default) {
            this.animations.forEach((a) => {
                if (animation.name !== a.name) {
                    a.default = false;
                }
            });
            this.play(animation.name);
        }
    }

    public play(name: string, force: boolean = false) {
        const animation = this.animations.get(name);
        if (!animation) {
            console.error(`Animation "${name}" not found`);
            this.stop();
            return;
        }

        if (this.currentAnimation === animation && !force) {
            return;
        }

        this.currentAnimation = animation;
        this.currentFrameIndex = 0;
        this.frameAccumulator = 0;
        this.playing = true;
        this.onAnimationChange.emit(animation);
    }

    public stop() {
        this.playing = false;
        this.currentAnimation = undefined;
        this.currentFrameIndex = 0;
        this.frameAccumulator = 0;
    }

    public hasAnimation(name: string): boolean {
        return this.animations.has(name);
    }

    public getCurrentAnimation(): SpriteAnimation | undefined {
        return this.currentAnimation;
    }

    public _process(delta: number): void {
        if (!this.playing || !this.currentAnimation) {
            return;
        }

        if (!this.currentAnimation.frames) {
            return;
        }

        this.frameAccumulator += delta;
        const frameDuration = 1 / this.currentAnimation.speed;

        if (this.frameAccumulator < frameDuration) {
            return;
        }

        const framesToAdvance = Math.floor(
            this.frameAccumulator / frameDuration,
        );
        this.frameAccumulator -= framesToAdvance * frameDuration;
        this.currentFrameIndex += framesToAdvance;

        if (this.currentFrameIndex >= this.currentAnimation.frames.length) {
            if (this.currentAnimation.loop) {
                this.currentFrameIndex %= this.currentAnimation.frames.length;
            } else {
                this.currentFrameIndex =
                    this.currentAnimation.frames.length - 1;
                this.stop();
            }
        }
    }

    public _draw(ctx: CanvasRenderingContext2D): void {
        if (
            !this.currentAnimation?.frames ||
            this.currentAnimation.frames.length === 0
        ) {
            return;
        }

        const currentFrame =
            this.currentAnimation.frames[this.currentFrameIndex];
        currentFrame.render(ctx);
    }
}

export interface AnimatedSpriteSettings extends Node2DSettings {}
