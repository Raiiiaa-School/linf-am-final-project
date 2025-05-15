import { Vector2 } from "../../../../core/utils";
import { BaseState, PlayerState } from "./base-state";

export class DeadState extends BaseState {
    protected animationName: string = "Dead";

    private readonly FRICTION = 2000;

    processPhysics(delta: number): PlayerState | undefined {
        if (this.player.getVelocity().x === 0) {
            return;
        }
        const currentVelX = this.player.getVelocity().x;
        this.player.setVelocityX(
            this.player.moveTowards(currentVelX, 0, this.FRICTION * delta),
        );

        this.player.moveAndSlide(this.player.getVelocity(), delta);
    }
}
