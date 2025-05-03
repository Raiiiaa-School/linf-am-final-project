import { TestScene } from "./game/scenes/test-scene";

const canvas = document.querySelector("canvas#game") as HTMLCanvasElement;
canvas.width = innerWidth;
canvas.height = innerHeight;

// importd the assets têm que ser a usar URL para o webpack conseguir buildar os assets.

const ctx = canvas.getContext("2d");

const scene = new TestScene();

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
