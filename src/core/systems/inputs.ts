import { Vector2 } from "../utils/vector2";

export class Input {
    private static instance: Input;
    private static pressedKeys: Set<string>;
    private static prevPressedKeys: Set<string>;
    private static prevPressedButtons: Set<number>;
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

    private constructor() {
        Input.prevPressedKeys = new Set();
        Input.pressedKeys = new Set();
        Input.prevPressedButtons = new Set();
        Input.pressedButtons = new Set();
        Input.mousePosition = new Vector2(0, 0);

        window.addEventListener("keydown", Input.handleKeyDown.bind(Input));
        window.addEventListener("keyup", Input.handleKeyUp.bind(Input));
        window.addEventListener("mousemove", Input.handleMouseMove.bind(Input));
        window.addEventListener("mousedown", Input.handleMouseDown.bind(Input));
        window.addEventListener("mouseup", Input.handleMouseUp.bind(Input));
        window.addEventListener(
            "contextmenu",
            Input.handleContextMenu.bind(Input),
        );
    }

    public static initialize(): Input {
        if (!this.instance) {
            this.instance = new Input();
        }
        return this.instance;
    }

    public static update(): void {
        Input.prevPressedKeys = new Set(Input.pressedKeys);
        Input.prevPressedButtons = new Set(Input.pressedButtons);
    }

    private static handleKeyDown(event: KeyboardEvent) {
        if (!Input.pressedKeys.has(event.key)) {
            Input.pressedKeys.add(event.key);
        }
    }

    private static handleKeyUp(event: KeyboardEvent) {
        Input.pressedKeys.delete(event.key);
    }

    private static handleMouseMove(event: MouseEvent) {
        Input.mousePosition.x = event.clientX;
        Input.mousePosition.y = event.clientY;
    }

    private static handleMouseDown(event: MouseEvent) {
        if (!Input.pressedButtons.has(event.button)) {
            Input.pressedButtons.add(event.button);
        }
    }

    private static handleMouseUp(event: MouseEvent) {
        Input.pressedButtons.delete(event.button);
    }

    private static handleContextMenu(event: MouseEvent) {
        event.preventDefault();
    }

    public static getMousePosition(): Vector2 {
        return Input.mousePosition;
    }

    public static getAxis(
        negative: keyof typeof Input.ACTIONS,
        positive: keyof typeof Input.ACTIONS,
    ): number {
        const positiveAction = Input.ACTIONS[positive];
        const negativeAction = Input.ACTIONS[negative];

        let axisValue = 0;
        if (Input.pressedKeys.has(positiveAction)) {
            axisValue += 1;
        }
        if (Input.pressedKeys.has(negativeAction)) {
            axisValue -= 1;
        }
        return axisValue;
    }

    public static isKeyPressed(key: keyof typeof Input.KEYS): boolean {
        return Input.pressedKeys.has(Input.KEYS[key]);
    }

    public static isActionPressed(action: keyof typeof Input.ACTIONS): boolean {
        return Input.pressedKeys.has(Input.ACTIONS[action]);
    }

    public static isMouseButtonPressed(button: number): boolean {
        return Input.pressedButtons.has(button);
    }

    public static isKeyJustPressed(key: keyof typeof Input.KEYS): boolean {
        const keyCode = Input.KEYS[key];
        return (
            Input.pressedKeys.has(keyCode) &&
            !Input.prevPressedKeys.has(keyCode)
        );
    }
    public static isActionJustPressed(
        action: keyof typeof Input.ACTIONS,
    ): boolean {
        const keyCode = Input.ACTIONS[action];
        return (
            Input.pressedKeys.has(keyCode) &&
            !Input.prevPressedKeys.has(keyCode)
        );
    }

    public static isMouseButtonJustPressed(button: number): boolean {
        return (
            Input.pressedButtons.has(button) &&
            !Input.prevPressedButtons.has(button)
        );
    }
}
