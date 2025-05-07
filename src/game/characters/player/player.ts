import { HealthComponent } from "../../components";
import { Entity } from "../entity";
import { Vector2 } from "../../../core/utils";
import { Input } from "../../../core/systems";

export class Player extends Entity {
    private readonly SPEED = 200;
    private readonly ACCELERATION = 3000;
    private readonly DECELERATION = 2000;
    private readonly JUMP_FORCE = 600;
    private readonly AIR_CONTROL = 0.3;

    private health = new HealthComponent(100);

    protected _ready(): void {
        this.health.onDeath.connect(this.didIDie);
    }

    protected _physicsProcess(delta: number): void {
        if (!this.isOnFloor()) {
            this.velocity.add(this.gravity.clone().multiply(delta));
            if (this.velocity.y > this.MAX_FALL_SPEED) {
                this.velocity.y = this.MAX_FALL_SPEED;
            }
        }
        const moveDir = Input.getAxis("MOVE_LEFT", "MOVE_RIGHT");

        let targetVelX = moveDir * this.SPEED;
        let currentVelX = this.velocity.x;

        const accelaration = this.isOnFloor()
            ? this.ACCELERATION
            : this.ACCELERATION * this.AIR_CONTROL;

        const deceleration = this.isGrounded
            ? this.DECELERATION
            : this.DECELERATION * this.AIR_CONTROL;

        if (Math.abs(targetVelX) > 0.1) {
            currentVelX = this.moveTowards(
                currentVelX,
                targetVelX,
                accelaration * delta,
            );
        } else {
            currentVelX = this.moveTowards(
                currentVelX,
                0,
                deceleration * delta,
            );
        }

        if (Input.isActionPressed("JUMP") && this.isOnFloor()) {
            this.velocity.y = -this.JUMP_FORCE;
            this.isGrounded = false;
        }

        this.moveAndSlide(new Vector2(currentVelX, this.velocity.y), delta);
    }

    protected didIDie(): void {
        console.log("I died");
    }
}
