import { Shape, Texture, Vector2 } from "../../../core/utils";
import { Player } from "./player";
import { CollisionShape, Sprite } from "../../../core/nodes";

const PlayerScene = new Player({
    name: "Player",
    position: new Vector2(150, 0),
    bounciness: 2,
    mass: 2,
})
    .addChild(
        new Sprite({
            texture: Texture.fromImage(
                new URL(
                    "../../../assets/characters/Shinobi/Idle.png",
                    import.meta.url,
                ),
            ),
        }),
    )
    .addChild(new CollisionShape({ shape: Shape.Rectangle(50, 50) }));

export default PlayerScene;
