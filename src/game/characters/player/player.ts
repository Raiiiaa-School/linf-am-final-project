import { HealthComponent } from "../../components";
import { Entity } from "../entity";
import { Vector2 } from "../../../core/utils";
import { Input } from "../../../core/systems";
import { AnimatedSprite } from "../../../core/nodes/animated-sprite";
import { Area } from "../../../core/nodes";
import { StateManager } from "./states/state-manager";
import { PlayerState } from "./states/base-state";

export class Player extends Entity {
    protected stateManager: StateManager = new StateManager(
        this,
        PlayerState.FALLING,
    );

    public animatedSprite$?: AnimatedSprite;
    public hitbox$?: Area;

    protected _ready(): void {
        this.animatedSprite$ = this.getNode<AnimatedSprite>("AnimatedSprite");
        this.hitbox$ = this.getNode<Area>("Hitbox");

        this.stateManager.init();

        this.hitbox$?.onAreaEntered.connect(this.onHurtBoxHit.bind(this));
        this.health.onDeath.connect(this.didIDie.bind(this));
    }

    protected _physicsProcess(delta: number): void {
        this.stateManager.processPhysics(delta);
    }

    protected _process(delta: number): void {
        this.stateManager.process(delta);
    }

    protected onHurtBoxHit(other: Area): void {
        this.health.takeDamage(50);
    }

    protected didIDie(): void {
        this.stateManager.changeState(PlayerState.DEAD);
    }
}
