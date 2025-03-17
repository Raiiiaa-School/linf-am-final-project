export class Frame {
    public image: HTMLImageElement;
    public duration: number;

    constructor(image: HTMLImageElement, duration: number) {
        this.image = image;
        this.duration = duration;
    }
}
