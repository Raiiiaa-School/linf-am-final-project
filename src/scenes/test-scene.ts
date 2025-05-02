import { Vector2 } from "../core/utils/vector2";
import { Camera } from "../core/nodes/camera";
import { Node2D } from "../core/nodes/node";
import { Sprite } from "../core/nodes/sprite";
import { Texture } from "../core/utils/texture";
import { RigidBody } from "../core/nodes/physics/rigidbody";
import { CollisionShape } from "../core/nodes/physics/collision-shape";
import { Shape } from "../core/utils/shape";
import { StaticBody } from "../core/nodes/physics/staticbody";
import { Colors } from "../core/constants/colors";
import { PhysicsEngine } from "../core/modules/physics-engine";

export class TestScene {
    private rootNode: Node2D;
    private player: Node2D;

    constructor() {
        this.player = new RigidBody({
            name: "Player",
            position: new Vector2(150, 0),
            mass: 2,
            bounciness: 0,
            friction: 0.1,
        })
            .addChild(
                new Sprite({
                    texture: Texture.fromColor(Colors.RED, 50, 50),
                }),
            )
            .addChild(new CollisionShape({ shape: Shape.Rectangle(50, 50) }));
        this.rootNode = new Node2D()
            .addChild(
                new RigidBody({
                    name: "Trash",
                    position: new Vector2(150, 100),
                    mass: 1,
                    bounciness: 1,
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
                    position: new Vector2(250, 500),
                })
                    .addChild(
                        new Sprite({
                            texture: Texture.fromColor(Colors.PINK, 250, 100),
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
