import { Vector2 } from "../core/utils/vector2";
import { Camera } from "../core/nodes/camera";
import { Node2D } from "../core/nodes/node";
import { Sprite } from "../core/nodes/sprite";
import { Texture } from "../core/utils/texture";

export class TestScene {
    private rootNode: Node2D;
    private player: Node2D;

    constructor() {
        this.player = new Node2D({ name: "Player" })
            .addChild(
                new Sprite({
                    texture: Texture.fromImage(
                        new URL("../assets/test.png", import.meta.url),
                    ),
                }),
            )
            .addChild(
                new Camera({
                    enabled: true,
                    offset: new Vector2(0, 0),
                    zoom: new Vector2(1, 1),
                    active: true,
                }),
            );
        this.rootNode = new Node2D()
            .addChild(
                new Sprite({
                    texture: Texture.fromImage(
                        new URL("../assets/glWla8v.png", import.meta.url),
                    ),
                }),
            )
            .addChild(this.player);
    }

    update(ctx: CanvasRenderingContext2D, delta: number) {
        this.player.position.x += 1;

        this.rootNode.update(delta);

        this.rootNode.draw(ctx);
    }
}
