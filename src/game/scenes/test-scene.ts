import { Vector2 } from "../../core/utils/vector2";
import { Camera } from "../../core/nodes/camera";
import { Node2D } from "../../core/nodes/node";
import { Sprite } from "../../core/nodes/sprite";
import { Texture } from "../../core/utils/texture";
import { RigidBody } from "../../core/nodes/physics/rigidbody";
import { CollisionShape } from "../../core/nodes/physics/collision-shape";
import { Shape } from "../../core/utils/shape";
import { StaticBody } from "../../core/nodes/physics/staticbody";
import { Colors } from "../../core/constants/colors";
import { PhysicsEngine } from "../../core/systems/physics-engine";
import { Player } from "../characters/player/player";
import PlayerScene from "../characters/player/player.scene";

export class TestScene {
    private rootNode: Node2D;

    constructor() {
        this.rootNode = new Node2D()
            .addChild(
                new RigidBody({
                    name: "Trash",
                    position: new Vector2(150, 100),
                    mass: 1,
                    bounciness: 10,
                    friction: 0.1,
                })
                    .addChild(
                        new Sprite({
                            texture: Texture.fromColor(Colors.ORANGE, 30, 30),
                        }),
                    )
                    .addChild(
                        new CollisionShape({ shape: Shape.Rectangle(30, 30) }),
                    ),
            )
            .addChild(
                new StaticBody({
                    position: new Vector2(300, 500),
                })
                    .addChild(
                        new Sprite({
                            texture: Texture.fromColor(Colors.PINK, 600, 100),
                        }),
                    )
                    .addChild(
                        new CollisionShape({
                            shape: Shape.Rectangle(600, 100),
                        }),
                    ),
            )
            .addChild(PlayerScene);
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
