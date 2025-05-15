import { PlayerState } from "./base-state";
import { MoveState } from "./move";

export class RunState extends MoveState {
    protected animationName: string = "Run";

    processPhysics(delta: number): PlayerState | undefined {
        return super.processPhysics(delta);
    }
}
