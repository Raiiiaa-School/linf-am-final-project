import { HealthComponent } from "../../components";
import { Entity } from "../entity";
import { Vector2 } from "../../../core/utils";
import { Input } from "../../../core/systems";
import { AnimatedSprite } from "src/core/nodes/animated-sprite";
import { Area } from "src/core/nodes";

export class Player extends Entity {
    private readonly SPEED = 200;
    private readonly ACCELERATION = 2000;
    private readonly FRICTION = 2000;
    private readonly JUMP_FORCE = 600;
    private readonly AIR_CONTROL = 0.3;

    private jumping = false;
    private dead = false;

    private animatedSprite$?: AnimatedSprite;
    private hitbox$?: Area;

    protected _ready(): void {
        this.animatedSprite$ = this.getNode<AnimatedSprite>("AnimatedSprite");
        this.hitbox$ = this.getNode<Area>("Hitbox");

        this.hitbox$?.onAreaEntered.connect(this.onHurtBoxHit.bind(this));
        this.health.onDeath.connect(this.didIDie.bind(this));
    }

    protected _physicsProcess(delta: number): void {
        if (!this.isOnFloor()) {
            this.velocity.add(this.gravity.clone().multiply(delta));
            if (this.velocity.y > this.MAX_FALL_SPEED) {
                this.velocity.y = this.MAX_FALL_SPEED;
            }

            if (this.isFalling() && !this.jumping && !this.dead) {
                this.animatedSprite$?.play("Fall");
            }
        }

        let currentVelX = this.velocity.x;
        if (!this.dead) {
            if (!this.isOnFloor()) {
                this.jumping = false;
            }
            const moveDir = Input.getAxis("MOVE_LEFT", "MOVE_RIGHT");

            let targetVelX = moveDir * this.SPEED;

            const accelaration = this.isOnFloor()
                ? this.ACCELERATION
                : this.ACCELERATION * this.AIR_CONTROL;

            const deceleration = this.isGrounded
                ? this.FRICTION
                : this.FRICTION * this.AIR_CONTROL;

            if (moveDir === -1) {
                this.animatedSprite$?.flipHorizontal();
            } else if (moveDir === 1) {
                this.animatedSprite$?.flipHorizontal(true);
            }

            if (Math.abs(targetVelX) > 0.1) {
                currentVelX = this.moveTowards(
                    currentVelX,
                    targetVelX,
                    accelaration * delta,
                );
                if (!this.isFalling() && !this.jumping) {
                    this.animatedSprite$?.play("Run");
                }
            } else {
                currentVelX = this.moveTowards(
                    currentVelX,
                    0,
                    deceleration * delta,
                );
                if (this.isOnFloor()) {
                    this.animatedSprite$?.play("Idle");
                }
            }

            if (Input.isActionPressed("JUMP") && this.isOnFloor()) {
                this.velocity.y = -this.JUMP_FORCE;
                this.isGrounded = false;
                this.animatedSprite$?.play("Jump");
                this.jumping = true;
            }
        } else {
            currentVelX = this.moveTowards(
                currentVelX,
                0,
                this.FRICTION * delta,
            );
        }

        this.moveAndSlide(new Vector2(currentVelX, this.velocity.y), delta);
    }

    protected isFalling() {
        return this.velocity.y > 100;
    }

    protected onHurtBoxHit() {
        this.health.takeDamage(50);
    }

    protected didIDie(): void {
        this.animatedSprite$?.play("Dead");
        this.dead = true;
    }
}
