import { Vector2 } from "../core/utils/vector2";
import { Camera } from "../core/nodes/camera";
import { Node2D } from "../core/nodes/node";
import { Sprite } from "../core/nodes/sprite";
import { Texture } from "../core/utils/texture";
import { Rigidbody } from "../core/nodes/physics/rigidbody";
import { CollisionShape } from "../core/nodes/physics/collision-shape";
import { Shape } from "../core/utils/shape";
import { StaticBody } from "../core/nodes/physics/staticbody";
import { COLORS } from "../core/constants/colors";
import { PhysicsEngine } from "../core/modules/physics-engine";

export class TestScene {
    private rootNode: Node2D;
    private player: Node2D;

    constructor() {
        this.player = new Rigidbody({
            name: "Player",
            position: new Vector2(150, 0),
            mass: 2,
        })
            .addChild(
                new Sprite({
                    texture: Texture.fromColor(COLORS.RED, 50, 50),
                }),
            )
            .addChild(new CollisionShape({ shape: Shape.Rectangle(50, 50) }));
        this.rootNode = new Node2D()
            .addChild(
                new Rigidbody({
                    position: new Vector2(250, 500),
                    mass: 5,
                })
                    .addChild(
                        new Sprite({
                            texture: Texture.fromColor(COLORS.PINK, 250, 100),
                        }),
                    )
                    .addChild(
                        new CollisionShape({
                            shape: Shape.Rectangle(250, 100),
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
        PhysicsEngine.update(delta);
        this.rootNode.update(delta);
        this.rootNode.draw(ctx);
    }
}
