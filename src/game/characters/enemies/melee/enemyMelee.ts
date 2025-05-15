import { AnimatedSprite } from "../../../../core/nodes/animated-sprite";
import { Entity } from "../../entity";
import { Vector2 } from "../../../../core/utils";
import { Area } from "../../../../core/nodes";

export class EnemyMelee extends Entity {
    private readonly SPEED = 200;
    private readonly ACCELERATION = 2000;
    private readonly FRICTION = 2000;
    private readonly JUMP_FORCE = 600;
    private readonly AIR_CONTROL = 0.3;

    private jumping = false;

    private animatedSprite$?: AnimatedSprite;
    private hitbox$?: Area;

    protected _ready(): void {
        this.animatedSprite$ = this.getNode<AnimatedSprite>("AnimatedSprite");
        this.hitbox$ = this.getNode<Area>("Hitbox");

        this.hitbox$?.onAreaEntered.connect(this.onAreaEntered.bind(this));
        this.health.onDeath.connect(this.didIDie.bind(this));
    }

    protected _physicsProcess(delta: number): void {
        if (!this.isOnFloor()) {
            this.velocity.add(this.gravity.clone().multiply(delta));
            if (this.velocity.y > this.MAX_FALL_SPEED) {
                this.velocity.y = this.MAX_FALL_SPEED;
            }

            if (this.isFalling() && !this.jumping) {
                this.animatedSprite$?.play("Fall");
            }
        }

        if (!this.isOnFloor()) {
            this.jumping = false;
        }

        this.moveAndSlide(new Vector2(0, this.velocity.y), delta);
    }

    protected isFalling() {
        return this.velocity.y > 100;
    }

    protected onAreaEntered(area: Area): void {
        this.health.takeDamage(50);
    }

    protected didIDie(): void {
        this.queueDestroy();
    }

    protected _destroy(): void {
        this.hitbox$?.onAreaEntered.disconnect(this.onAreaEntered.bind(this));
        super._destroy();
    }
}
