import { Signal, Texture, Vector2 } from "../utils";
import { SpriteAnimation } from "../utils/animation";
import { Node2D, Node2DSettings } from "./node";

export class AnimatedSprite extends Node2D {
    private animations: Map<string, SpriteAnimation> = new Map();
    private currentAnimation?: SpriteAnimation;
    private currentFrameIndex: number = 0;
    private frameAccumulator: number = 0;
    private playing: boolean = false;
    private paused: boolean = false;
    private flip = Vector2.ONE;
    private defaultAnimationName?: string;

    public onAnimationEnd = new Signal<void>();
    public onAnimationStart = new Signal<SpriteAnimation>();
    public onAnimationLoop = new Signal<void>();

    constructor(settings?: AnimatedSpriteSettings) {
        super(settings);

        this.name = settings?.name ?? "AnimatedSprite";
    }

    public hasAnimation(name: string): boolean {
        return this.animations.has(name);
    }

    public getCurrentAnimation(): SpriteAnimation | undefined {
        return this.currentAnimation;
    }

    public addAnimation(animation: SpriteAnimation) {
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
            this.defaultAnimationName = animation.name;
            this.play(animation.name);
        }
    }

    public play(name?: string, force: boolean = false) {
        const animation = this.animations.get(
            name ?? this.defaultAnimationName ?? "",
        );
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
        this.onAnimationStart.emit(animation);
    }

    public pause() {
        this.paused = true;
    }

    public unpause() {
        this.paused = false;
    }

    public stop() {
        this.playing = false;
        this.frameAccumulator = 0;
        this.onAnimationEnd.emit();
    }

    flipHorizontal(reset: boolean = false) {
        if (reset) {
            this.flip.x = 1;
            return;
        }
        this.flip.x = -1;
    }

    flipVertical(reset: boolean = false) {
        if (reset) {
            this.flip.y = 1;
            return;
        }
        this.flip.y = -1;
    }

    public _process(delta: number): void {
        if (!this.playing || !this.currentAnimation) {
            return;
        }

        if (!this.currentAnimation.frames) {
            return;
        }

        if (this.paused) {
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
                this.onAnimationLoop.emit();
            } else {
                this.currentFrameIndex =
                    this.currentAnimation.frames.length - 1;
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

        ctx.save();
        ctx.scale(this.flip.x, this.flip.y);
        currentFrame.render(ctx);
        ctx.restore();
    }
}

export interface AnimatedSpriteSettings extends Node2DSettings {}
