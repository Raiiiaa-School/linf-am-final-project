import { Signal } from "../utils/signal";
import { Node2D, Node2DSettings } from "./node";

// Reutilizei o Timer criado no projeto DOM de AM
export class Timer extends Node2D {
    private duration: number;
    private loop: boolean;
    private autoStart: boolean;

    private isRunning: boolean = false;
    private remaining: number;
    private startTime?: number;
    private timeoutId?: NodeJS.Timeout;

    public onTimeout = new Signal();

    constructor(settings: TimerSettings) {
        super(settings);
        this.duration = settings.duration;
        this.loop = settings?.loop ?? false;
        this.remaining = this.duration;
        this.autoStart = settings?.autoStart ?? false;
    }

    protected _ready(): void {
        if (this.autoStart) {
            this.start();
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startTime = Date.now();
        this.timeoutId = setTimeout(() => {
            this.onTimeout.emit();
            if (this.loop) {
                this.restart();
            } else {
                this.stop();
            }
        }, this.remaining);
    }

    pause() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
        this.remaining -= Date.now() - (this.startTime ?? 0);
    }

    stop(reset = false) {
        this.isRunning = false;
        clearTimeout(this.timeoutId);
        if (reset) {
            this.remaining = this.duration;
        }
    }

    restart() {
        this.stop(true);
        this.start();
    }

    setDuration(duration: number) {
        this.duration = duration;
        this.remaining = duration;
    }

    setLoop(loop: boolean) {
        this.loop = loop;
    }

    getRemaining() {
        if (!this.isRunning) {
            return this.remaining;
        }
        return this.remaining - (Date.now() - (this.startTime ?? 0));
    }
}

interface TimerSettings extends Node2DSettings {
    duration: number;
    loop?: boolean;
    autoStart?: boolean;
}
