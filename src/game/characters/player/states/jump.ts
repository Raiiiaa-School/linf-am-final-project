import { Vector2 } from "../../../../core/utils";
import { Input } from "../../../../core/systems";
import { BaseState, PlayerState } from "./base-state";
import { Player } from "../player";

export class JumpState extends BaseState {
    protected animationName: string = "Jump";

    protected readonly JUMP_FORCE = 600;
    protected readonly AIR_CONTROL = 0.3;
    protected readonly SPEED = 200;
    protected readonly ACCELERATION = 2000;
    protected readonly FRICTION = 2000;

    enter(): void {
        super.enter();
        this.player.setVelocity(
            new Vector2(
                this.player.getVelocity().x,
                this.player.getVelocity().y + -this.JUMP_FORCE,
            ),
        );
    }

    processPhysics(delta: number): PlayerState | undefined {
        super.processPhysics(delta);
        this.player.setVelocity(
            this.player
                .getVelocity()
                .add(this.player.getGravity().clone().multiply(delta)),
        );

        if (this.player.getVelocity().y > this.player.MAX_FALL_SPEED) {
            this.player.setVelocity(
                new Vector2(
                    this.player.getVelocity().x,
                    this.player.MAX_FALL_SPEED,
                ),
            );
        }

        const moveDir = Input.getAxis("MOVE_LEFT", "MOVE_RIGHT");

        let currentVelX = this.player.getVelocity().x;
        let targetVelX = moveDir * this.SPEED;

        if (moveDir !== 0) {
            currentVelX = this.player.moveTowards(
                currentVelX,
                targetVelX,
                this.ACCELERATION * delta,
            );
        } else {
            currentVelX = this.player.moveTowards(
                currentVelX,
                0,
                this.FRICTION * delta,
            );
        }

        this.player.moveAndSlide(
            new Vector2(currentVelX, this.player.getVelocity().y),
            delta,
        );

        if (this.player.getVelocity().y > 0) {
            return PlayerState.FALLING;
        }

        if (this.player.isOnFloor()) {
            if (moveDir !== 0) {
                return PlayerState.RUNNING;
            } else {
                return PlayerState.IDLE;
            }
        }
    }
}
