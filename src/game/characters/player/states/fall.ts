import { Input } from "../../../../core/systems";
import { Vector2 } from "../../../../core/utils";
import { BaseState, PlayerState } from "./base-state";

export class FallState extends BaseState {
    protected animationName: string = "Fall";

    protected readonly SPEED = 200;
    protected readonly ACCELERATION = 2000;
    protected readonly FRICTION = 2000;
    protected readonly AIR_CONTROL = 0.3;

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

        if (this.player.isOnFloor()) {
            return PlayerState.IDLE;
        }

        if (moveDir === 0) {
            currentVelX = this.player.moveTowards(
                currentVelX,
                0,
                this.FRICTION * this.AIR_CONTROL * delta,
            );
        } else {
            currentVelX = this.player.moveTowards(
                currentVelX,
                targetVelX,
                this.ACCELERATION * this.AIR_CONTROL * delta,
            );
        }

        this.player.moveAndSlide(
            new Vector2(currentVelX, this.player.getVelocity().y),
            delta,
        );
    }

    isFalling(): boolean {
        return this.player.getVelocity().y > 10;
    }
}
