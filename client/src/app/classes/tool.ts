import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    currentWidth: number;
    lastWidth: number;
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    shortcut: string;
    index: number;
    localShortcuts: Map<string, () => void>;
    currentCommand: () => void;
    history: Vec2[][];

    constructor(protected drawingService: DrawingService) {}

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseClick(event: MouseEvent): void {}

    onDoubleClick(event: MouseEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    localShortCutHandler(key: string): void {
        this.currentCommand = this.localShortcuts.get(key) as () => void;
        this.currentCommand();
    }
    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {}
}
