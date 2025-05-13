import { Signal } from "../../utils";
import { PhysicsEngine } from "../../systems/physics-engine";
import { CollisionObject, CollisionObjectSettings } from "./collision-object";
import { PhysicsObject } from "./physics-object";

export class Area extends CollisionObject {
    protected monitorable: boolean; // Can be detected by other areas
    protected monitoring: boolean; // Can detect other areas

    protected overlappingAreas: Set<Area> = new Set();
    protected overlappingBodies: Set<PhysicsObject> = new Set();

    public onAreaEntered = new Signal<Area>();
    public onAreaExited = new Signal<Area>();
    public onBodyEntered = new Signal<PhysicsObject>();
    public onBodyExited = new Signal<PhysicsObject>();

    constructor(settings?: AreaSettings) {
        super(settings);
        this.monitorable = settings?.monitorable ?? true;
        this.monitoring = settings?.monitoring ?? true;

        PhysicsEngine.addArea(this);
    }

    public isMonitorable(): boolean {
        return this.monitorable;
    }

    public isMonitoring(): boolean {
        return this.monitoring;
    }

    public getOverlappingAreas() {
        return this.overlappingAreas;
    }

    public getOverlappingObjects() {
        return this.overlappingBodies;
    }

    public addOverlappingArea(area: Area) {
        if (!this.overlappingAreas.has(area)) {
            this.overlappingAreas.add(area);
            this.onAreaEntered.emit(area);
        }

        const body = this.parent;
        if (body instanceof PhysicsObject) {
            if (!this.overlappingBodies.has(body)) {
                this.overlappingBodies.add(body);
                this.onBodyEntered.emit(body);
            }
        }
    }

    public removeOverlappingArea(area: Area) {
        if (this.overlappingAreas.has(area)) {
            this.overlappingAreas.delete(area);
            this.onAreaExited.emit(area);
        }

        const body = this.parent;
        if (body instanceof PhysicsObject) {
            if (this.overlappingBodies.has(body)) {
                this.overlappingBodies.delete(body);
                this.onBodyExited.emit(body);
            }
        }
    }
}

export interface AreaSettings extends CollisionObjectSettings {
    monitorable?: boolean;
    monitoring?: boolean;
}
