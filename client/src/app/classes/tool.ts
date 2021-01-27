import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    protected mouseDownCoord: Vec2;
    protected mouseDown: boolean = false;
    icon: any;
    shortcut: string;
    localShortcuts: Map<string, () => void>;
    currentCommand: () => void;

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
}
