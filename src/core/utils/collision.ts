import { Vector2 } from "./vector2";

export interface CollisionInfo {
    colliding: boolean;
    mtv?: Vector2; // Minimum Translation Vector
    overlap?: number; // Amount of overlap between colliding objects
}
