import { CharacterBody, CharacterBodySettings } from "../../core/nodes";
import { HealthComponent } from "../components";

export class Entity extends CharacterBody {
    public health = new HealthComponent(100);

    constructor(settings: CharacterBodySettings) {
        super(settings);
    }
}
