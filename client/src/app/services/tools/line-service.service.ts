import { Injectable } from '@angular/core';
import { Tool, ToolStyles } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineHelperService } from './line-helper.service';
import { PencilService } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class LineServiceService extends Tool {
    shortcutToBeUsed: () => void;
    shiftIsPressed: boolean = false;
    private isStarted: boolean;
    private startingPoint: Vec2;
    private endPoint: Vec2;
    lineWidth: number;
    eventTest: boolean;
    currentSegment: Vec2[] = [];
    currentLine: Vec2[][] = [];
    pencilService: PencilService;
    toolStyles: ToolStyles;
    angledEndPoint: Vec2;
    calledFromMouseClick: boolean = false;
    lineHelper: LineHelperService;

    constructor(drawingService: DrawingService, pencilService: PencilService, lineHelper: LineHelperService) {
        super(drawingService);
        this.isStarted = false;
        this.shortcut = 'l';
        this.localShortcuts = new Map([
            ['Shift', this.onShift],
            ['Backspace', this.onBackspace],
            ['Escape', this.onEscape],
        ]);
        this.index = 1;
        this.pencilService = pencilService;
        this.toolStyles = { lineColor: 'blue', lineWidth: 5 };
        this.lineHelper = lineHelper;
    }

    localShortCutHandler(key: string): void {
        this.shortcutToBeUsed = this.localShortcuts.get(key) as () => void;
        this.shortcutToBeUsed();
    }

    onEscape(): void {
        this.isStarted = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.currentLine = [];
    }

    onBackspace(): void {
        if (this.drawingService.drawingHistory.size > 0) {
            let index: number = Array.from(this.drawingService.drawingHistory).length - 1;
            let last = Array.from(this.drawingService.drawingHistory)[index][1][0];
            while (last !== this) {
                if (index > 0) {
                    last = Array.from(this.drawingService.drawingHistory)[--index][1][0];
                } else {
                    return;
                }
            }
            const lastLine = Array.from(this.drawingService.drawingHistory)[index][0];
            this.drawingService.drawingHistory.delete(lastLine);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            for (const entry of this.drawingService.drawingHistory.entries()) {
                entry[1][0].redrawLine(this.drawingService.baseCtx, entry[0], entry[1][1]);
            }
            this.drawingService.pencilDrawings.forEach((item) => {
                this.pencilService.redrawLine(this.drawingService.baseCtx, item);
            });
        }
    }

    setShiftIfPressed = () => {
        this.shiftIsPressed = true;
        if (!this.lineHelper.shiftAngleCalculator(this.startingPoint, this.endPoint) && this.isStarted) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.redrawCurrentPreview();
            const line: Vec2[] = [this.startingPoint, this.lineHelper.closestAngledPoint(this.startingPoint, this.endPoint)];
            this.angledEndPoint = line[1];
            this.drawLine(this.drawingService.previewCtx, line);
        }
        window.removeEventListener('keydown', this.setShiftIfPressed);
        this.eventTest = false;
    };

    setShiftNonPressed = (e?: KeyboardEvent) => {
        if ((e != undefined && e.key === 'Shift') || this.calledFromMouseClick) {
            this.shiftIsPressed = false;
            window.removeEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = false;
            if (this.isStarted) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.redrawCurrentPreview();
                this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
            }
        }
    };

    onShift(): void {
        if (!this.eventTest) {
            // window.addEventListener('keydown', this.setShiftIfPressed);
            this.setShiftIfPressed();
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = true;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            this.drawLine(this.drawingService.baseCtx, [this.startingPoint, this.endPoint]);
        }
        this.mouseDown = false;
    }

    redrawCurrentPreview(): void {
        for (let line of this.currentLine) {
            this.drawLine(this.drawingService.previewCtx, line);
        }
    }
    redrawCurrentBase(): void {
        for (let line of this.currentLine) {
            this.drawLine(this.drawingService.baseCtx, line);
        }
        this.currentLine = [];
    }

    onMouseClick(event: MouseEvent): void {
        if (!this.isStarted) {
            this.isStarted = true;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPoint = this.mouseDownCoord;
        } else {
            if (!this.shiftIsPressed) {
                const mousePosition = this.getPositionFromMouse(event);
                this.endPoint = mousePosition;
            } else {
                this.endPoint = this.angledEndPoint;
            }
            this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
            this.currentLine.push([this.startingPoint, this.endPoint]);
            this.startingPoint = this.endPoint;
            if (this.shiftIsPressed) {
                this.calledFromMouseClick = true;
                this.endPoint = this.getPositionFromMouse(event);
                this.setShiftNonPressed();
                this.calledFromMouseClick = false;
            }
        }
    }

    onDoubleClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.lineHelper.pixelDistanceUtil(this.startingPoint, mousePosition)) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            //this.drawLine(this.drawingService.baseCtx, line);
            this.redrawCurrentBase();
            return;
        } else {
            if (!this.shiftIsPressed) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.endPoint = mousePosition;
                this.currentLine.push([this.startingPoint, this.endPoint]);
                //this.drawLine(this.drawingService.baseCtx, [this.startingPoint, this.endPoint]);
                this.redrawCurrentBase();
            } else {
                this.endPoint = this.angledEndPoint;
                this.currentLine.push([this.startingPoint, this.endPoint]);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.redrawCurrentBase();
            }
        }
        this.isStarted = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isStarted) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            if (this.shiftIsPressed) {
                if (this.lineHelper.shiftAngleCalculator(this.startingPoint, this.endPoint)) {
                    this.angledEndPoint = this.endPoint;
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.redrawCurrentPreview();
                    this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
                }
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.redrawCurrentPreview();
                this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
            }
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.setStyles();
        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
            this.drawingService.drawingHistory.set(path, [this, { ...this.toolStyles }]);
        }
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;
        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[], style: ToolStyles): void {
        this.toolStyles = style;
        this.setStyles();
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }
}
