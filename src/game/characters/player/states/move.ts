import { Vector2 } from "../../../../core/utils";
import { Input } from "../../../../core/systems";
import { Player } from "../player";
import { BaseState, PlayerState } from "./base-state";

export class MoveState extends BaseState {
    protected animationName: string = "Run";
    protected readonly SPEED = 200;
    protected readonly ACCELERATION = 2000;

    processPhysics(delta: number): PlayerState | undefined {
        super.processPhysics(delta);

        if (Input.isActionJustPressed("JUMP")) {
            return PlayerState.JUMPING;
        }

        if (!this.player.isOnFloor() && this.isFalling()) {
            return PlayerState.FALLING;
        }

        const moveDir = Input.getAxis("MOVE_LEFT", "MOVE_RIGHT");
        if (moveDir === 0) {
            return PlayerState.IDLE;
        }

        let currentVelX = this.player.getVelocity().x;
        let targetVelX = moveDir * this.SPEED;

        currentVelX = this.player.moveTowards(
            currentVelX,
            targetVelX,
            this.ACCELERATION * delta,
        );

        this.player.moveAndSlide(
            new Vector2(currentVelX, this.player.getVelocity().y),
            delta,
        );
    }

    isFalling(): boolean {
        return this.player.getVelocity().y > 100;
    }
}
