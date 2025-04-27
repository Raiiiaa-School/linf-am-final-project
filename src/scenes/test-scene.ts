import { Vector2 } from "../core/utils/vector2";
import { Camera } from "../core/nodes/camera";
import { Node2D } from "../core/nodes/node";
import { Sprite } from "../core/nodes/sprite";
import { Texture } from "../core/utils/texture";
import { Rigidbody } from "../core/nodes/rigidbody";
import { CollisionShape } from "../core/nodes/collision-shape";
import { RectangleShape } from "../core/utils/shape";
import { StaticBody } from "../core/nodes/staticbody";
import { COLORS } from "../core/constants/colors";
import { CollisionManager } from "../core/manager/collision-manager";

export class TestScene {
    private rootNode: Node2D;
    private player: Node2D;

    constructor() {
        this.player = new Rigidbody({
            name: "Player",
            position: new Vector2(100, 0),
        })
            .addChild(
                new Sprite({
                    texture: Texture.fromColor(COLORS.RED, 50, 50),
                }),
            )
            .addChild(
                new CollisionShape({ shape: new RectangleShape(50, 50) }),
            );
        this.rootNode = new Node2D()
            .addChild(
                new StaticBody({ position: new Vector2(0, 720) })
                    .addChild(
                        new Sprite({
                            texture: Texture.fromColor(COLORS.PINK, 2000, 200),
                        }),
                    )
                    .addChild(
                        new CollisionShape({
                            shape: new RectangleShape(2000, 200),
                        }),
                    ),
            )
            .addChild(this.player);
    }

    start() {
        return new Promise<void>((resolve) => {
            this.rootNode.initialize();
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }

    update(ctx: CanvasRenderingContext2D, delta: number) {
        this.rootNode.update(delta);
        CollisionManager.update();
        this.rootNode.draw(ctx);
    }
}
