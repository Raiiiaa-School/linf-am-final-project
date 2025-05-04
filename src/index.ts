import { Input } from "./core/systems/inputs";
import { TestScene } from "./game/scenes/test-scene";

const canvas = document.querySelector("canvas#game") as HTMLCanvasElement;
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext("2d");

const scene = new TestScene();

Input.initialize();

let lastTime = 0;

async function start() {
    lastTime = performance.now();
    await scene.start();
    requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp: number) {
    if (!ctx) {
        throw new Error("Failed to get 2D context");
    }

    const deltaTime = Math.min(timeStamp - lastTime, 50) / 1000;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    scene.update(ctx, deltaTime);

    requestAnimationFrame(gameLoop);
}

start();
