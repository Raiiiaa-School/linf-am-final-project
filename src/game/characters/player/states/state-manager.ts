import { Player } from "../player";
import { BaseState, PlayerState } from "./base-state";
import { DeadState } from "./dead";
import { FallState } from "./fall";
import { IdleState } from "./idle";
import { JumpState } from "./jump";
import { MoveState } from "./move";
import { RunState } from "./run";

export class StateManager {
    public player: Player;
    public initialState: PlayerState;
    public currentState?: BaseState;

    private states = new Map<PlayerState, BaseState>();

    constructor(player: Player, initialState: PlayerState) {
        this.player = player;
        this.initialState = initialState;
    }

    public init() {
        this.states.set(PlayerState.IDLE, new IdleState(this.player));
        this.states.set(PlayerState.RUNNING, new RunState(this.player));
        this.states.set(PlayerState.JUMPING, new JumpState(this.player));
        this.states.set(PlayerState.FALLING, new FallState(this.player));
        // this.states.set(PlayerState.DASHING, new DashingState(this.player));
        // this.states.set(PlayerState.ATTACKING, new AttackingState(this.player));
        // this.states.set(PlayerState.DEFENDING, new DefendingState(this.player));
        this.states.set(PlayerState.DEAD, new DeadState(this.player));

        this.changeState(this.initialState);
    }

    public changeState(newState: PlayerState) {
        const state = this.states.get(newState);
        if (!state) {
            console.error(`State "${newState}" does not exist on the player`);
            return;
        }

        if (this.currentState) {
            this.currentState.exit();
        }

        this.currentState = state;
        this.currentState.enter();

        console.log(`Changing to state "${newState}"`);
    }

    public processPhysics(delta: number) {
        const newState = this.currentState?.processPhysics(delta);
        if (newState) {
            this.changeState(newState);
        }
    }

    public process(delta: number) {
        const newState = this.currentState?.process(delta);
        if (newState) {
            this.changeState(newState);
        }
    }
}
