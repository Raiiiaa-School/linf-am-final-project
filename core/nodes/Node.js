// Base Node class - foundation for all game objects
class Node {
    constructor({
        name = "Node",
        children = [],
        parent = undefined,
        position = new Vector2D(),
        rotation = 0,
        scale = new Vector2D(),
        visible = true,
        active = true,
    } = NodeSettings) {
        this.name = name;
        this.children = children;
        this.parent = parent;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.visible = visible;
        this.active = active;
    }
}

// Node2D - base for all 2D objects with visual representation
class Node2D extends Node {
    constructor({
        name = "Node",
        children = [],
        parent = undefined,
        position = new Vector2D(),
        rotation = 0,
        scale = new Vector2D(),
        visible = true,
        active = true,
    }) {
        super({
            name,
            children,
            parent,
            position,
            rotation,
            scale,
            visible,
            active,
        });
        this.zIndex = 0;
    }
}

const NodeSettings = {
    name: "Node",
    children: [],
    parent: undefined,
    position: new Vector2D(),
    rotation: 0,
    scale: new Vector2D(),
    visible: true,
    active: true,
};
