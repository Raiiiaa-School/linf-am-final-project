import { Shape, Texture, Vector2 } from "../../../core/utils";
import { Player } from "./player";
import { Area, CollisionShape, Sprite } from "../../../core/nodes";
import { AnimatedSprite } from "../../../core/nodes/animated-sprite";

const playerAnimations = new AnimatedSprite();
const spriteSize = new Vector2(150, 150);

playerAnimations.addAnimation({
    name: "Idle",
    loop: true,
    speed: 6,
    default: true,
    frames: Texture.fromSpriteSheet(
        new URL("../../../assets/characters/Shinobi/Idle.png", import.meta.url),
        {
            frameCount: 6,
            size: spriteSize,
        },
    ),
});

playerAnimations.addAnimation({
    name: "Run",
    loop: true,
    speed: 6,
    frames: Texture.fromSpriteSheet(
        new URL("../../../assets/characters/Shinobi/Run.png", import.meta.url),
        { frameCount: 8, size: spriteSize, offset: new Vector2(10, 0) },
    ),
});

playerAnimations.addAnimation({
    name: "Jump",
    loop: false,
    speed: 6,
    frames: Texture.fromSpriteSheet(
        new URL("../../../assets/characters/Shinobi/Jump.png", import.meta.url),
        { frameCount: 12, size: spriteSize },
    ),
});

playerAnimations.addAnimation({
    name: "Dead",
    loop: false,
    speed: 4,
    frames: Texture.fromSpriteSheet(
        new URL("../../../assets/characters/Shinobi/Dead.png", import.meta.url),
        { frameCount: 4, size: spriteSize },
    ),
});

playerAnimations.addAnimation({
    name: "Fall",
    loop: true,
    speed: 10,
    frames: Texture.fromSpriteSheet(
        new URL("../../../assets/characters/Shinobi/Jump.png", import.meta.url),
        { frameCount: 12, size: spriteSize, start: 9, end: 10 },
    ),
});

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
    )
    .addChild(
        new Area({ name: "Hitbox" }).addChild(
            new CollisionShape({ shape: Shape.Rectangle(50, 50), debug: true }),
        ),
    );

export default PlayerScene;
