import { PhysicsEngine } from "src/core/modules/physics-engine";
import { CollisionObject, CollisionObjectSettings } from "./collision-object";

export class Area extends CollisionObject {
    protected monitorable: boolean; // Can be detected by other areas
    protected monitoring: boolean; // Can detect other areas

    constructor(settings?: AreaSettings) {
        super(settings);
        this.monitorable = settings?.monitorable ?? true;
        this.monitoring = settings?.monitoring ?? true;

        PhysicsEngine.addArea(this);
    }

    public onCollision(other: CollisionObject): void {
        if (!this.monitoring) {
            return;
        }
    }
}

export interface AreaSettings extends CollisionObjectSettings {
    monitorable?: boolean;
    monitoring?: boolean;
}
