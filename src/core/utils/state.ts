export interface State<T> {
    enter(): void;
    process(delta: number): T | undefined;
    processPhysics(delta: number): T | undefined;
    exit(): void;
}
