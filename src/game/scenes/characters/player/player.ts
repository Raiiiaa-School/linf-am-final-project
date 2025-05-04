import { Vector2 } from "../../../../core/utils/vector2";
import { Input } from "../../../../core/systems/inputs";
import { Entity } from "../entity";
import { HealthComponent } from "../../../components/health-component";

export class Player extends Entity {
    private readonly SPEED = 500;
    private readonly FRICTION = 1500;
    private readonly JUMP_VELOCITY = -1000;

    private health = new HealthComponent(100);

    protected _ready(): void {
        this.health.onDeath.connect(this.didIDie);
    }

    protected _physicsProcess(delta: number): void {
        if (!this.isOnFloor() && this.useGravity) {
            const newVelY = this.velocity.y + this.gravity.y * delta;
            this.velocity.y = Math.min(newVelY, this.MAX_FALL_SPEED);
        }

        if (Input.isActionPressed("JUMP")) {
            this.health.takeDamage(50);
            this.velocity.y = this.JUMP_VELOCITY;
        }

        let direction = Input.getAxis("MOVE_LEFT", "MOVE_RIGHT");
        if (direction !== 0) {
            this.velocity.x = direction * this.SPEED;
        } else {
            this.velocity.x = this.moveTowards(
                this.velocity.x,
                0,
                this.FRICTION * delta,
            );
        }
        this.moveAndSlide(delta);
    }

    protected didIDie(): void {
        console.log("I died");
    }
}
