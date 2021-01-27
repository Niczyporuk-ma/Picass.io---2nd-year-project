import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    protected mouseDownCoord: Vec2;
    protected mouseDown: boolean = false;
    public icon: any;
    public shortcut: string;
    public localShortcuts: Map<string, Function>;
    public currentCommand : Function;

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseClick(event: MouseEvent): void {}

    onDoubleClick(event: MouseEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    localShortCutHandler(key: string) {
        this.currentCommand = <Function>this.localShortcuts.get(key);
        this.currentCommand();
    }
}
