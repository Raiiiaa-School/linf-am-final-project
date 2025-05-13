import { Area, CollisionShape } from "../../../../core/nodes";
import { AnimatedSprite } from "../../../../core/nodes/animated-sprite";
import { Shape, Texture, Vector2 } from "../../../../core/utils";
import { Entity } from "../../entity";
import { EnemyMelee } from "./enemyMelee";

const animations = new AnimatedSprite();
const spriteSize = new Vector2(150, 150);

animations.addAnimation({
    name: "Idle",
    loop: true,
    speed: 6,
    default: true,
    frames: Texture.fromSpriteSheet(
        new URL(
            "../../../../assets/characters/Shinobi/Idle.png",
            import.meta.url,
        ),
        {
            frameCount: 6,
            size: spriteSize,
        },
    ),
});

const EnemyMeleeScene = new EnemyMelee({
    name: "Enemy",
    position: new Vector2(500, 0),
})
    .addChild(animations)
    .addChild(
        new CollisionShape({
            shape: Shape.Rectangle(20, 75),
            debug: true,
            position: new Vector2(0, 37),
        }),
    )
    .addChild(
        new Area({ name: "Hurtbox" }).addChild(
            new CollisionShape({ shape: Shape.Rectangle(50, 50), debug: true }),
        ),
    );

export default EnemyMeleeScene;
