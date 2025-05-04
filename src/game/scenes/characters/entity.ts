import {
    CharacterBody,
    CharacterBodySettings,
} from "../../../core/nodes/physics/charactedbody";

export class Entity extends CharacterBody {
    constructor(settings: CharacterBodySettings) {
        super(settings);
    }
}
