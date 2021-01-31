import { DrawingService } from '@app/services/drawing/drawing.service';
import { Vec2 } from './vec2';

export interface ToolStyles {
    lineColor: string;
    lineWidth: number;
    fill?: boolean;
    fillColor?: string;
}

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    shortcut: string;
    index: number;
    localShortcuts: Map<string, () => void>;
    currentCommand: () => void;
    history: Vec2[][];
    styles: ToolStyles;

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
    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[], style: ToolStyles): void {}

    setStyles(): void {
        if (this.styles.fill) {
            this.drawingService.previewCtx.fillStyle = this.styles.fillColor as string;
            this.drawingService.baseCtx.fillStyle = this.styles.fillColor as string;
        }
        this.drawingService.previewCtx.strokeStyle = this.styles.lineColor;
        this.drawingService.baseCtx.strokeStyle = this.styles.lineColor;
        this.drawingService.previewCtx.lineWidth = this.styles.lineWidth;
        this.drawingService.baseCtx.lineWidth = this.styles.lineWidth;
    }
}
