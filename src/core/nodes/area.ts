import { CollisionObject } from "./collision-object";

export class Area2D extends CollisionObject {
    private areas: Set<CollisionObject> = new Set();
    private onAreaEntered: ((area: CollisionObject) => void) | undefined =
        undefined;
    private onAreaExited: ((area: CollisionObject) => void) | undefined =
        undefined;

    constructor(name: string = "") {
        super(name);
    }

    public setOnAreaEntered(callback: (area: CollisionObject) => void): Area2D {
        this.onAreaEntered = callback;
        return this;
    }

    public setOnAreaExited(callback: (area: CollisionObject) => void): Area2D {
        this.onAreaExited = callback;
        return this;
    }

    public getOverlappingAreas(): CollisionObject[] {
        return Array.from(this.areas);
    }

    public handleAreaEntered(area: CollisionObject) {
        if (!this.areas.has(area)) {
            this.areas.add(area);
            if (this.onAreaEntered) {
                this.onAreaEntered(area);
            }
        }
    }

    public handleAreaExited(area: CollisionObject) {
        if (!this.areas.has(area)) {
            this.areas.add(area);
            if (this.onAreaExited) {
                this.onAreaExited(area);
            }
        }
    }
}
