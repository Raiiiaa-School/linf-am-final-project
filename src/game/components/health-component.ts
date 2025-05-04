import { Signal } from "../../core/utils/signal";

export class HealthComponent {
    private maxHealth: number;
    private currentHealth: number;

    public onDeath = new Signal();
    public onHealthChange = new Signal<number>();

    constructor(maxHealth: number, currentHealth?: number) {
        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth ?? maxHealth;
    }

    public getHealth(): number {
        return this.currentHealth;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public setMaxHealth(maxHealth: number): void {
        if (maxHealth < 0) {
            throw new Error("Max health cannot be negative");
        }

        this.maxHealth = maxHealth;
        this.currentHealth = Math.min(this.currentHealth, maxHealth);
        this.onHealthChange.emit(this.currentHealth);
    }

    public takeDamage(amount: number): void {
        this.currentHealth -= amount;

        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.onDeath.emit();
        }

        this.onHealthChange.emit(this.currentHealth);
    }

    public heal(amount: number): void {
        this.currentHealth += amount;

        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }

        this.onHealthChange.emit(this.currentHealth);
    }
}
