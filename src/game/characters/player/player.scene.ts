import { Shape, Texture, Vector2 } from "../../../core/utils";
import { Player } from "./player";
import { CollisionShape, Sprite } from "../../../core/nodes";
import { AnimatedSprite } from "../../../core/nodes/animated-sprite";

const playerAnimations = new AnimatedSprite();
const spriteSize = new Vector2(150, 150);

playerAnimations.addAnimation(
    {
        name: "Idle",
        loop: true,
        speed: 6,
        default: true,
        frames: Texture.fromSpriteSheet(
            new URL(
                "../../../assets/characters/Shinobi/Idle.png",
                import.meta.url,
            ),
            {
                frameCount: 6,
                size: spriteSize,
            },
        ),
    },
    true,
);

const PlayerScene = new Player({
    name: "Player",
    position: new Vector2(150, 0),
})
    .addChild(playerAnimations)
    .addChild(
        new CollisionShape({
            shape: Shape.Rectangle(20, 75),
            position: new Vector2(0, 37),
        }),
    );

export default PlayerScene;
