export class Signal<T = void> {
    private listeners: Set<SignalHandler<T>> = new Set();

    public connect(handler: SignalHandler<T>) {
        this.listeners.add(handler);
    }

    public disconnect(handler: SignalHandler<T>) {
        this.listeners.delete(handler);
    }

    public emit(args: T) {
        this.listeners.forEach((handler) => handler(args));
    }

    public clear() {
        this.listeners.clear();
    }
}

type SignalHandler<T = void> = (args: T) => void;
