import { Node2D } from "./core/nodes/node";
import { Sprite } from "./core/nodes/sprite";
import { Texture } from "./core/utils/texture";
import { TestScene } from "./scenes/test-scene";

const canvas = document.querySelector("canvas#game") as HTMLCanvasElement;
canvas.width = innerWidth;
canvas.height = innerHeight;

// importd the assets têm que ser a usar URL para o webpack conseguir buildar os assets.

const ctx = canvas.getContext("2d");

const scene = new TestScene();

start();

function start() {
    if (!ctx) {
        throw new Error("Failed to get 2D context");
    }

    requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        scene.update(ctx, 0);

        start();
    });
}
