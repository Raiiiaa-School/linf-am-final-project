import { Input } from "../../../../core/systems";
import { State } from "../../../../core/utils/state";
import { Player } from "../player";

export enum PlayerState {
    IDLE = "Idle",
    RUNNING = "Running",
    JUMPING = "Jumping",
    FALLING = "Falling",
    DASHING = "Dashing",
    ATTACKING = "Attacking",
    DEAD = "Dead",
}

export class BaseState implements State<PlayerState> {
    protected player: Player;
    protected animationName: string = "";

    constructor(player: Player) {
        this.player = player;
    }

    enter(): void {
        this.player.animatedSprite$?.play(this.animationName);
    }

    process(delta: number): PlayerState | undefined {
        return;
    }

    processPhysics(delta: number): PlayerState | undefined {
        const moveDir = Input.getAxis("MOVE_LEFT", "MOVE_RIGHT");
        if (moveDir === -1) {
            this.player.animatedSprite$?.flipHorizontal();
        } else if (moveDir === 1) {
            this.player.animatedSprite$?.flipHorizontal(true);
        }
        return;
    }

    exit(): void {}
}
