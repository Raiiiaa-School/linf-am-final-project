import { Vector2 } from "../utils/vector2";

export class Input {
    private static pressedKeys: Set<string>;
    private static pressedButtons: Set<number>;
    private static mousePosition: Vector2;

    static KEYS = {
        Q: "q",
        W: "w",
        E: "e",
        R: "r",
        T: "t",
        Y: "y",
        U: "u",
        I: "i",
        O: "o",
        P: "p",
        A: "a",
        S: "s",
        D: "d",
        F: "f",
        G: "g",
        H: "h",
        J: "j",
        K: "k",
        L: "l",
        M: "m",
        Z: "z",
        X: "x",
        C: "c",
        V: "v",
        B: "b",
        N: "n",

        COMMA: ",",
        PERIOD: ".",
        SLASH: "/",
        BACKSLASH: "\\",
        MINUS: "-",
        EQUALS: "=",
        LEFT_BRACKET: "[",
        RIGHT_BRACKET: "]",
        SEMICOLON: ";",
        QUOTE: "'",
        BACKQUOTE: "`",
        ESCAPE: "Escape",
        TAB: "Tab",
        ENTER: "Enter",
        SHIFT: "Shift",
        CONTROL: "Control",
        ALT: "Alt",
        SPACE: " ",
        ARROW_UP: "ArrowUp",
        ARROW_DOWN: "ArrowDown",
        ARROW_LEFT: "ArrowLeft",
        ARROW_RIGHT: "ArrowRight",
    };

    static ACTIONS = {
        JUMP: Input.KEYS.SPACE,
        MOVE_LEFT: Input.KEYS.A,
        MOVE_RIGHT: Input.KEYS.D,
        MOVE_UP: Input.KEYS.W,
        MOVE_DOWN: Input.KEYS.S,
        DASH: Input.KEYS.SHIFT,
        USE: Input.KEYS.E,
        ATTACK: Input.KEYS.J,
        SPECIAL_ATTACK: Input.KEYS.K,
        PAUSE: Input.KEYS.ESCAPE,
        MENU: Input.KEYS.TAB,
    };

    constructor() {
        Input.pressedKeys = new Set();
        Input.pressedButtons = new Set();
        Input.mousePosition = new Vector2(0, 0);

        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
        window.addEventListener("mousemove", this.handleMouseMove.bind(this));
        window.addEventListener("mousedown", this.handleMouseDown.bind(this));
        window.addEventListener("mouseup", this.handleMouseUp.bind(this));
        window.addEventListener(
            "contextmenu",
            this.handleContextMenu.bind(this),
        );
    }

    private handleKeyDown(event: KeyboardEvent) {
        Input.pressedKeys.add(event.key);
    }

    private handleKeyUp(event: KeyboardEvent) {
        Input.pressedKeys.delete(event.key);
    }

    private handleMouseMove(event: MouseEvent) {
        Input.mousePosition.x = event.clientX;
        Input.mousePosition.y = event.clientY;
    }

    private handleMouseDown(event: MouseEvent) {
        Input.pressedButtons.add(event.button);
    }

    private handleMouseUp(event: MouseEvent) {
        Input.pressedButtons.delete(event.button);
    }

    private handleContextMenu(event: MouseEvent) {
        event.preventDefault();
    }

    public getMousePosition(): Vector2 {
        return Input.mousePosition;
    }

    public isKeyPressed(key: keyof typeof Input.KEYS): boolean {
        return Input.pressedKeys.has(key);
    }

    public isActionPressed(action: keyof typeof Input.ACTIONS): boolean {
        return Input.pressedKeys.has(action);
    }

    public isMouseButtonPressed(button: number): boolean {
        return Input.pressedButtons.has(button);
    }
}
