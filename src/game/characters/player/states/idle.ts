import { Input } from "../../../../core/systems";
import { Vector2 } from "../../../../core/utils";
import { BaseState, PlayerState } from "./base-state";
import { MoveState } from "./move";

export class IdleState extends MoveState {
    protected animationName: string = "Idle";
    protected readonly FRICTION = 2000;

    enter(): void {
        this.player.animatedSprite$?.play(this.animationName);
    }

    process(delta: number): PlayerState | undefined {
        super.process(delta);
        if (Input.getAxis("MOVE_LEFT", "MOVE_RIGHT") !== 0) {
            return PlayerState.RUNNING;
        }
    }

    processPhysics(delta: number): PlayerState | undefined {
        if (this.isFalling()) {
            return PlayerState.FALLING;
        }

        if (Input.isActionJustPressed("JUMP")) {
            return PlayerState.JUMPING;
        }

        let currentVelX = this.player.getVelocity().x;
        currentVelX = this.player.moveTowards(
            currentVelX,
            0,
            this.FRICTION * delta,
        );

        this.player.moveAndSlide(
            new Vector2(currentVelX, this.player.getVelocity().y),
            delta,
        );
        return;
    }
}
