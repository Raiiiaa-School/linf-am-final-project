import { Game } from "./core/game";
import {
    CharacterBody,
    CollisionShape,
    RetangleShape,
    RigidBody,
    Sprite,
    StaticBody,
} from "./core/nodes";

// Example usage:
const canvas = document.querySelector("canvas#game") as HTMLCanvasElement;
canvas.width = innerWidth;
canvas.height = innerHeight;
const game = new Game(canvas);

const node = new Sprite().setColor("#000000", 50, 50);
game.addNode(node);

// Start the game
game.start();
