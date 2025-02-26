// Base Node class - foundation for all game objects
class Node {
    constructor(name = "Node") {
        this.name = name;
        this.children = [];
        this.parent = null;
        this.position = { x: 0, y: 0 };
        this.rotation = 0;
        this.scale = { x: 1, y: 1 };
        this.visible = true;
        this.active = true;
    }

    // Add a child node
    addChild(node) {
        if (node.parent) {
            node.parent.removeChild(node);
        }
        this.children.push(node);
        node.parent = this;
        return node;
    }

    // Remove a child node
    removeChild(node) {
        const index = this.children.indexOf(node);
        if (index !== -1) {
            this.children.splice(index, 1);
            node.parent = null;
        }
        return node;
    }

    // Get global position (considering parent transformations)
    getGlobalPosition() {
        if (!this.parent) {
            return { ...this.position };
        }

        const parentGlobal = this.parent.getGlobalPosition();
        return {
            x: parentGlobal.x + this.position.x,
            y: parentGlobal.y + this.position.y,
        };
    }

    // Process frame updates
    process(deltaTime) {
        if (!this.active) return;

        // Custom logic can be implemented in derived classes
        this._process(deltaTime);

        // Process all children
        for (const child of this.children) {
            child.process(deltaTime);
        }
    }

    // Override this in derived classes
    _process(deltaTime) {}

    // Render this node and its children
    render(ctx) {
        if (!this.visible) return;

        // Save context state
        ctx.save();

        // Apply transformations
        const pos = this.getGlobalPosition();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale.x, this.scale.y);

        // Custom rendering in derived classes
        this._render(ctx);

        // Render all children
        for (const child of this.children) {
            child.render(ctx);
        }

        // Restore context state
        ctx.restore();
    }

    // Override this in derived classes
    _render(ctx) {}
}

// Node2D - base for all 2D objects with visual representation
class Node2D extends Node {
    constructor(name = "Node2D") {
        super(name);
        this.zIndex = 0;
    }
}

// Sprite - visual representation using images
class Sprite extends Node2D {
    constructor(name = "Sprite") {
        super(name);
        this.texture = null;
        this.width = 0;
        this.height = 0;
        this.anchor = { x: 0.5, y: 0.5 }; // Center by default
    }

    setTexture(texture) {
        this.texture = texture;
        if (texture) {
            this.width = texture.width;
            this.height = texture.height;
        }
    }

    _render(ctx) {
        if (!this.texture) return;

        ctx.drawImage(
            this.texture,
            -this.width * this.anchor.x,
            -this.height * this.anchor.y,
            this.width,
            this.height
        );
    }
}

// AnimatedSprite - handles sprite animations
class AnimatedSprite extends Sprite {
    constructor(name = "AnimatedSprite") {
        super(name);
        this.animations = {}; // Map of animation name to frames
        this.currentAnimation = "";
        this.frameIndex = 0;
        this.frameTime = 0;
        this.animationSpeed = 0.1; // Seconds per frame
    }

    addAnimation(name, frames) {
        this.animations[name] = frames;
        if (!this.currentAnimation) {
            this.play(name);
        }
    }

    play(name) {
        if (!this.animations[name]) return;

        this.currentAnimation = name;
        this.frameIndex = 0;
        this.frameTime = 0;
        this.setTexture(this.animations[name][0]);
    }

    _process(deltaTime) {
        if (!this.currentAnimation) return;

        const frames = this.animations[this.currentAnimation];
        if (!frames || frames.length === 0) return;

        this.frameTime += deltaTime;
        if (this.frameTime >= this.animationSpeed) {
            this.frameTime -= this.animationSpeed;
            this.frameIndex = (this.frameIndex + 1) % frames.length;
            this.setTexture(frames[this.frameIndex]);
        }
    }
}

// Shape2D - base class for collision shapes
class Shape2D extends Node2D {
    constructor(name = "Shape2D") {
        super(name);
        this.debug = false; // Whether to render the shape
        this.debugColor = "rgba(0, 255, 0, 0.3)";
    }

    // To be implemented by derived classes
    contains(point) {
        return false;
    }

    // To be implemented by derived classes
    intersects(shape) {
        return false;
    }
}

// RectangleShape - rectangle collision shape
class RectangleShape extends Shape2D {
    constructor(width = 10, height = 10, name = "RectangleShape") {
        super(name);
        this.width = width;
        this.height = height;
    }

    contains(point) {
        const halfW = this.width / 2;
        const halfH = this.height / 2;
        const globalPos = this.getGlobalPosition();

        return (
            point.x >= globalPos.x - halfW &&
            point.x <= globalPos.x + halfW &&
            point.y >= globalPos.y - halfH &&
            point.y <= globalPos.y + halfH
        );
    }

    intersects(shape) {
        if (shape instanceof RectangleShape) {
            const posA = this.getGlobalPosition();
            const posB = shape.getGlobalPosition();

            const halfWidthA = this.width / 2;
            const halfHeightA = this.height / 2;
            const halfWidthB = shape.width / 2;
            const halfHeightB = shape.height / 2;

            return !(
                posA.x + halfWidthA < posB.x - halfWidthB ||
                posA.x - halfWidthA > posB.x + halfWidthB ||
                posA.y + halfHeightA < posB.y - halfHeightB ||
                posA.y - halfHeightA > posB.y + halfHeightB
            );
        }

        return false;
    }

    _render(ctx) {
        if (!this.debug) return;

        ctx.fillStyle = this.debugColor;
        const halfW = this.width / 2;
        const halfH = this.height / 2;
        ctx.fillRect(-halfW, -halfH, this.width, this.height);

        ctx.strokeStyle = "green";
        ctx.lineWidth = 1;
        ctx.strokeRect(-halfW, -halfH, this.width, this.height);
    }
}

// CircleShape - circle collision shape
class CircleShape extends Shape2D {
    constructor(radius = 5, name = "CircleShape") {
        super(name);
        this.radius = radius;
    }

    contains(point) {
        const globalPos = this.getGlobalPosition();
        const dx = point.x - globalPos.x;
        const dy = point.y - globalPos.y;
        return dx * dx + dy * dy <= this.radius * this.radius;
    }

    intersects(shape) {
        if (shape instanceof CircleShape) {
            const posA = this.getGlobalPosition();
            const posB = shape.getGlobalPosition();

            const dx = posA.x - posB.x;
            const dy = posA.y - posB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            return distance <= this.radius + shape.radius;
        } else if (shape instanceof RectangleShape) {
            // Circle to rectangle collision
            const circlePos = this.getGlobalPosition();
            const rectPos = shape.getGlobalPosition();

            // Find closest point on rectangle to circle center
            const closestX = Math.max(
                rectPos.x - shape.width / 2,
                Math.min(circlePos.x, rectPos.x + shape.width / 2)
            );
            const closestY = Math.max(
                rectPos.y - shape.height / 2,
                Math.min(circlePos.y, rectPos.y + shape.height / 2)
            );

            // Calculate distance
            const dx = closestX - circlePos.x;
            const dy = closestY - circlePos.y;
            const distanceSquared = dx * dx + dy * dy;

            return distanceSquared <= this.radius * this.radius;
        }

        return false;
    }

    _render(ctx) {
        if (!this.debug) return;

        ctx.fillStyle = this.debugColor;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "green";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// CollisionObject2D - base for physics objects
class CollisionObject2D extends Node2D {
    constructor(name = "CollisionObject2D") {
        super(name);
        this.shape = null;
        this.collisionLayer = 1;
        this.collisionMask = 1;
    }

    setShape(shape) {
        if (this.shape) {
            this.removeChild(this.shape);
        }
        this.shape = shape;
        if (shape) {
            this.addChild(shape);
        }
    }

    collidesWith(other) {
        if (!this.shape || !other.shape) return false;
        if (!(this.collisionLayer & other.collisionMask)) return false;
        if (!(other.collisionLayer & this.collisionMask)) return false;

        return this.shape.intersects(other.shape);
    }
}

// Area2D - detects collisions but doesn't have physics
class Area2D extends CollisionObject2D {
    constructor(name = "Area2D") {
        super(name);
        this.overlappingBodies = new Set();
        this.enteredSignal = []; // Callbacks for body entered
        this.exitedSignal = []; // Callbacks for body exited
    }

    onBodyEntered(callback) {
        this.enteredSignal.push(callback);
    }

    onBodyExited(callback) {
        this.exitedSignal.push(callback);
    }

    _processOverlaps(bodies) {
        const newOverlaps = new Set();

        // Check for new overlaps
        for (const body of bodies) {
            if (body !== this && this.collidesWith(body)) {
                newOverlaps.add(body);

                // If not previously overlapping, emit entered signal
                if (!this.overlappingBodies.has(body)) {
                    for (const callback of this.enteredSignal) {
                        callback(body);
                    }
                }
            }
        }

        // Check for ended overlaps
        for (const body of this.overlappingBodies) {
            if (!newOverlaps.has(body)) {
                for (const callback of this.exitedSignal) {
                    callback(body);
                }
            }
        }

        this.overlappingBodies = newOverlaps;
    }
}

// RigidBody2D - physics body with collision response
class RigidBody2D extends CollisionObject2D {
    constructor(name = "RigidBody2D") {
        super(name);
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.mass = 1;
        this.gravity = 980; // pixels per second squared
        this.isStatic = false;
        this.friction = 0.2;
        this.elasticity = 0.5; // Bounciness
    }

    _process(deltaTime) {
        if (this.isStatic) return;

        // Apply gravity
        this.velocity.y += this.gravity * deltaTime;

        // Apply acceleration
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;

        // Apply velocity to position
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }

    // Handle collision with another body
    resolveCollision(other) {
        if (!this.shape || !other.shape || (this.isStatic && other.isStatic))
            return;

        // Simple collision response
        const thisPos = this.getGlobalPosition();
        const otherPos = other.getGlobalPosition();

        // Direction from other to this
        const dx = thisPos.x - otherPos.x;
        const dy = thisPos.y - otherPos.y;

        // Normalize
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) return;

        const nx = dx / len;
        const ny = dy / len;

        if (other.isStatic) {
            // Reflect velocity if other is static
            const dot = this.velocity.x * nx + this.velocity.y * ny;

            this.velocity.x = this.velocity.x - 2 * dot * nx * this.elasticity;
            this.velocity.y = this.velocity.y - 2 * dot * ny * this.elasticity;

            // Apply friction to perpendicular component
            const perpX = -ny;
            const perpY = nx;
            const perpDot = this.velocity.x * perpX + this.velocity.y * perpY;

            this.velocity.x = this.velocity.x - perpDot * perpX * this.friction;
            this.velocity.y = this.velocity.y - perpDot * perpY * this.friction;
        } else {
            // Momentum exchange if both are dynamic
            const relVelX = this.velocity.x - other.velocity.x;
            const relVelY = this.velocity.y - other.velocity.y;

            const relVelDotNormal = relVelX * nx + relVelY * ny;
            if (relVelDotNormal > 0) return; // Moving away already

            const e = (this.elasticity + other.elasticity) / 2;
            const totalMass = this.mass + other.mass;
            const impulse = (-(1 + e) * relVelDotNormal) / totalMass;

            // Apply impulse
            this.velocity.x += impulse * nx * other.mass;
            this.velocity.y += impulse * ny * other.mass;

            other.velocity.x -= impulse * nx * this.mass;
            other.velocity.y -= impulse * ny * this.mass;
        }
    }
}

// TileMap - grid-based level design
class TileMap extends Node2D {
    constructor(tileWidth = 32, tileHeight = 32, name = "TileMap") {
        super(name);
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tiles = {}; // Map of "x,y" to tile data
        this.tileset = null;
        this.tileDefinitions = {}; // Properties for different tile types
    }

    setTile(x, y, tileId) {
        if (tileId === null || tileId === undefined) {
            delete this.tiles[`${x},${y}`];
        } else {
            this.tiles[`${x},${y}`] = { id: tileId };
        }
    }

    getTile(x, y) {
        return this.tiles[`${x},${y}`] || null;
    }

    defineTile(id, properties) {
        this.tileDefinitions[id] = properties;
    }

    worldToTile(worldX, worldY) {
        const pos = this.getGlobalPosition();
        return {
            x: Math.floor((worldX - pos.x) / this.tileWidth),
            y: Math.floor((worldY - pos.y) / this.tileHeight),
        };
    }

    tileToWorld(tileX, tileY) {
        const pos = this.getGlobalPosition();
        return {
            x: pos.x + tileX * this.tileWidth,
            y: pos.y + tileY * this.tileHeight,
        };
    }

    setTileset(tileset, tileWidth, tileHeight) {
        this.tileset = tileset;
        this.tilesetColumns = Math.floor(tileset.width / tileWidth);
    }

    _render(ctx) {
        if (!this.tileset) return;

        const viewport = {
            x: -ctx.canvas.width / 2,
            y: -ctx.canvas.height / 2,
            width: ctx.canvas.width,
            height: ctx.canvas.height,
        };

        // Calculate visible tile range
        const startTile = this.worldToTile(viewport.x, viewport.y);
        const endTile = this.worldToTile(
            viewport.x + viewport.width,
            viewport.y + viewport.height
        );

        // Render visible tiles
        for (let y = startTile.y; y <= endTile.y; y++) {
            for (let x = startTile.x; x <= endTile.x; x++) {
                const tile = this.getTile(x, y);
                if (!tile) continue;

                const tileId = tile.id;
                const tileX = tileId % this.tilesetColumns;
                const tileY = Math.floor(tileId / this.tilesetColumns);

                ctx.drawImage(
                    this.tileset,
                    tileX * this.tileWidth,
                    tileY * this.tileHeight,
                    this.tileWidth,
                    this.tileHeight,
                    x * this.tileWidth,
                    y * this.tileHeight,
                    this.tileWidth,
                    this.tileHeight
                );
            }
        }
    }

    // Generate collision bodies for tiles with collision
    generateCollisionBodies() {
        const bodies = [];

        for (const key in this.tiles) {
            const [x, y] = key.split(",").map(Number);
            const tile = this.tiles[key];
            const def = this.tileDefinitions[tile.id];

            if (def && def.collision) {
                const body = new RigidBody2D(`Tile_${x}_${y}`);
                body.isStatic = true;

                const shape = new RectangleShape(
                    this.tileWidth,
                    this.tileHeight
                );
                body.setShape(shape);

                const worldPos = this.tileToWorld(x, y);
                body.position.x = worldPos.x + this.tileWidth / 2;
                body.position.y = worldPos.y + this.tileHeight / 2;

                bodies.push(body);
            }
        }

        return bodies;
    }
}

// Scene - container for the entire level
class Scene extends Node {
    constructor(name = "Scene") {
        super(name);
        this.collisionBodies = [];
    }

    registerCollisionBody(body) {
        this.collisionBodies.push(body);
    }

    unregisterCollisionBody(body) {
        const index = this.collisionBodies.indexOf(body);
        if (index !== -1) {
            this.collisionBodies.splice(index, 1);
        }
    }

    _process(deltaTime) {
        // Process physics
        this._processPhysics(deltaTime);

        // Process areas
        for (const body of this.collisionBodies) {
            if (body instanceof Area2D) {
                body._processOverlaps(this.collisionBodies);
            }
        }
    }

    _processPhysics(deltaTime) {
        // First pass: Move all bodies
        for (const body of this.collisionBodies) {
            if (body instanceof RigidBody2D) {
                body._process(deltaTime);
            }
        }

        // Second pass: Resolve collisions
        for (let i = 0; i < this.collisionBodies.length; i++) {
            const bodyA = this.collisionBodies[i];

            if (!(bodyA instanceof RigidBody2D)) continue;

            for (let j = i + 1; j < this.collisionBodies.length; j++) {
                const bodyB = this.collisionBodies[j];

                if (!(bodyB instanceof RigidBody2D)) continue;

                if (bodyA.collidesWith(bodyB)) {
                    bodyA.resolveCollision(bodyB);
                    bodyB.resolveCollision(bodyA);
                }
            }
        }
    }
}

// Camera2D - handles viewport and following objects
class Camera2D extends Node2D {
    constructor(name = "Camera2D") {
        super(name);
        this.target = null;
        this.smoothing = 0.1; // 0 to 1, higher is more responsive
        this.limits = {
            left: null,
            right: null,
            top: null,
            bottom: null,
        };
    }

    setTarget(node) {
        this.target = node;
    }

    _process(deltaTime) {
        if (!this.target) return;

        const targetPos = this.target.getGlobalPosition();

        // Calculate desired position
        let desiredX = -targetPos.x;
        let desiredY = -targetPos.y;

        // Apply limits
        if (this.limits.left !== null && desiredX > -this.limits.left) {
            desiredX = -this.limits.left;
        }
        if (this.limits.right !== null && desiredX < -this.limits.right) {
            desiredX = -this.limits.right;
        }
        if (this.limits.top !== null && desiredY > -this.limits.top) {
            desiredY = -this.limits.top;
        }
        if (this.limits.bottom !== null && desiredY < -this.limits.bottom) {
            desiredY = -this.limits.bottom;
        }

        // Smooth movement
        this.position.x += (desiredX - this.position.x) * this.smoothing;
        this.position.y += (desiredY - this.position.y) * this.smoothing;
    }

    // Apply camera transform to rendering context
    applyTransform(ctx) {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.translate(this.position.x, this.position.y);
    }
}

// Input handler
class Input {
    constructor() {
        this.keys = {};
        this.previousKeys = {};
        this.mousePosition = { x: 0, y: 0 };
        this.mouseButtons = {};
        this.previousMouseButtons = {};

        // Set up event listeners
        window.addEventListener("keydown", this._onKeyDown.bind(this));
        window.addEventListener("keyup", this._onKeyUp.bind(this));
        window.addEventListener("mousedown", this._onMouseDown.bind(this));
        window.addEventListener("mouseup", this._onMouseUp.bind(this));
        window.addEventListener("mousemove", this._onMouseMove.bind(this));
    }

    _onKeyDown(event) {
        this.keys[event.code] = true;
    }

    _onKeyUp(event) {
        this.keys[event.code] = false;
    }

    _onMouseDown(event) {
        this.mouseButtons[event.button] = true;
    }

    _onMouseUp(event) {
        this.mouseButtons[event.button] = false;
    }

    _onMouseMove(event) {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }

    // Check if a key is currently pressed
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }

    // Check if a key was just pressed this frame
    isKeyJustPressed(keyCode) {
        return !!this.keys[keyCode] && !this.previousKeys[keyCode];
    }

    // Check if a key was just released this frame
    isKeyJustReleased(keyCode) {
        return !this.keys[keyCode] && !!this.previousKeys[keyCode];
    }

    // Check if a mouse button is pressed
    isMouseButtonPressed(button) {
        return !!this.mouseButtons[button];
    }

    // Check if a mouse button was just pressed this frame
    isMouseButtonJustPressed(button) {
        return (
            !!this.mouseButtons[button] && !this.previousMouseButtons[button]
        );
    }

    // Update input state for next frame
    update() {
        this.previousKeys = { ...this.keys };
        this.previousMouseButtons = { ...this.mouseButtons };
    }
}

// Game - main game class that brings everything together
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.activeScene = null;
        this.input = new Input();
        this.assets = {
            images: {},
            sounds: {},
        };

        this.lastTime = 0;
        this.running = false;

        // Resize canvas to fit window
        this._resizeCanvas();
        window.addEventListener("resize", this._resizeCanvas.bind(this));
    }

    _resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    async loadImage(key, url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.assets.images[key] = img;
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    setActiveScene(scene) {
        this.activeScene = scene;
    }

    start() {
        if (this.running) return;

        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this._gameLoop.bind(this));
    }

    stop() {
        this.running = false;
    }

    _gameLoop(timestamp) {
        if (!this.running) return;

        // Calculate delta time
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Process and render active scene
        if (this.activeScene) {
            // Find the camera
            let camera = null;
            const findCamera = (node) => {
                if (node instanceof Camera2D) {
                    camera = node;
                    return true;
                }

                for (const child of node.children) {
                    if (findCamera(child)) return true;
                }

                return false;
            };

            findCamera(this.activeScene);

            // Process scene
            this.activeScene.process(deltaTime);

            // Apply camera transform if available
            this.ctx.save();
            if (camera) {
                camera.applyTransform(this.ctx);
            }

            // Render scene
            this.activeScene.render(this.ctx);

            this.ctx.restore();
        }

        // Update input for next frame
        this.input.update();

        // Schedule next frame
        requestAnimationFrame(this._gameLoop.bind(this));
    }
}

// Player class - example of putting it all together
class Player extends RigidBody2D {
    constructor(name = "Player") {
        super(name);

        // Physics properties
        this.gravity = 1000;
        this.moveSpeed = 300;
        this.jumpForce = -600;
        this.mass = 1;
        this.friction = 0.1;
        this.elasticity = 0.2;

        // State
        this.isOnGround = false;
        this.isFacingRight = true;
        this.currentState = "idle";

        // Create sprite
        this.sprite = new AnimatedSprite("PlayerSprite");
        this.addChild(this.sprite);

        // Create collision shape
        this.collisionShape = new RectangleShape(32, 64);
        this.collisionShape.debug = true;
        this.setShape(this.collisionShape);

        // Create ground detector (Area2D)
        this.groundDetector = new Area2D("GroundDetector");
        const groundShape = new RectangleShape(28, 10);
        groundShape.position.y = 32; // Bottom of player
        this.groundDetector.setShape(groundShape);
        this.addChild(this.groundDetector);

        // Setup ground detection
        this.groundDetector.onBodyEntered(this._onGroundEntered.bind(this));
        this.groundDetector.onBodyExited(this._onGroundExited.bind(this));
    }

    _onGroundEntered(body) {
        if (body !== this && body instanceof RigidBody2D) {
            this.isOnGround = true;
        }
    }

    _onGroundExited(body) {
        // Check if we're still touching any ground
        if (this.groundDetector.overlappingBodies.size === 0) {
            this.isOnGround = false;
        }
    }

    setupAnimations(game) {
        // Example of setting up animations (assuming sprite sheet is loaded)
        const sheet = game.assets.images.playerSheet;

        // Create frame arrays (would need to be adjusted for actual sprite sheet)
        const frames = {
            idle: [],
            run: [],
            jump: [],
            fall: [],
        };

        // Example: create a temporary canvas to extract sprites from sheet
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = 32;
        tempCanvas.height = 64;
    }
}
