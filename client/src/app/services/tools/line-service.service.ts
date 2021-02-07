import { Injectable } from '@angular/core';
import { Tool, ToolStyles } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from './color.service';
import { LineHelperService } from './line-helper.service';

@Injectable({
    providedIn: 'root',
})
export class LineServiceService extends Tool {
    shortcutToBeUsed: () => void;
    shiftIsPressed: boolean = false;
    isStarted: boolean;
    startingPoint: Vec2;
    endPoint: Vec2;
    lineWidth: number;
    eventTest: boolean;
    currentSegment: Vec2[] = [];
    currentLine: Vec2[][] = [];
    segmentStyles: ToolStyles[] = [];
    junctions: Vec2[] = [];
    junctionsRadius: number[] = [];
    currentDiameter: number = 1;
    toolStyles: ToolStyles;
    angledEndPoint: Vec2;
    calledFromMouseClick: boolean = false;
    lineHelper: LineHelperService;
    colorService: ColorService;
    angle: number;
    mousePosition: Vec2;
    hasJunction: boolean = true;

    constructor(drawingService: DrawingService, lineHelper: LineHelperService, colorService: ColorService) {
        super(drawingService);
        this.isStarted = false;
        this.shortcut = 'l';
        this.localShortcuts = new Map([
            ['Shift', this.onShift],
            ['Backspace', this.onBackspace],
            ['Escape', this.onEscape],
        ]);
        this.index = 1;
        this.toolStyles = { primaryColor: 'black', lineWidth: 5 };
        this.lineHelper = lineHelper;
        this.colorService = colorService;
    }

    clearArrays(): void {
        this.clearLineAndJunctions();
    }

    localShortCutHandler(key: string): void {
        this.shortcutToBeUsed = this.localShortcuts.get(key) as () => void;
        this.shortcutToBeUsed();
    }

    onEscape(): void {
        this.isStarted = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearLineAndJunctions();
    }

    clearLineAndJunctions(): void {
        this.currentLine = [];
        this.segmentStyles = [];
        this.junctions = [];
        this.junctionsRadius = [];
    }

    onBackspace(): void {
        if (this.currentLine.length > 0) {
            this.startingPoint = this.currentLine[this.currentLine.length - 1][0];
            this.currentLine.pop();
            this.segmentStyles.pop();
            this.junctions.pop();
            this.junctionsRadius.pop();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.redrawCurrentPreview();
            this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
        }
    }

    setShiftIsPressed = () => {
        this.shiftIsPressed = true;
        if (!this.lineHelper.shiftAngleCalculator(this.startingPoint, this.endPoint) && this.isStarted) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.redrawCurrentPreview();
            const line: Vec2[] = [this.startingPoint, this.lineHelper.closestAngledPoint(this.startingPoint, this.endPoint)];
            this.angledEndPoint = line[1];
            this.drawLine(this.drawingService.previewCtx, line);
        }
        window.removeEventListener('keydown', this.setShiftIsPressed);
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
                this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.mousePosition]);
            }
        }
    };

    onShift(): void {
        if (!this.eventTest) {
            // window.addEventListener('keydown', this.setShiftIsPressed);
            this.setShiftIsPressed();
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = true;
        }
    }

    drawJunction(ctx: CanvasRenderingContext2D, center: Vec2, radius: number) {
        if (this.hasJunction) {
            ctx.beginPath();
            ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'black';
            ctx.fill();
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
        for (const line of this.currentLine) {
            this.drawLine(this.drawingService.previewCtx, line);
        }
        if (this.junctions.length > 0) {
            for (const [index, junction] of this.junctions.entries()) {
                this.drawJunction(this.drawingService.previewCtx, junction, this.junctionsRadius[index]);
            }
        }
    }
    redrawCurrentBase(): void {
        for (const line of this.currentLine) {
            this.drawLine(this.drawingService.baseCtx, line);
        }
        if (this.junctions.length > 0) {
            for (const [index, junction] of this.junctions.entries()) {
                this.drawJunction(this.drawingService.baseCtx, junction, this.junctionsRadius[index]);
            }
        }
        this.clearLineAndJunctions();
    }

    pushNewJunction(center: Vec2, radius: number): void {
        this.junctions.push(center);
        this.junctionsRadius.push(radius);
    }

    onMouseClick(event: MouseEvent): void {
        if (!this.isStarted) {
            this.isStarted = true;
            this.startingPoint = this.getPositionFromMouse(event);
            this.pushNewJunction(this.startingPoint, this.currentDiameter / 2);
            this.drawJunction(this.drawingService.previewCtx, this.startingPoint, this.currentDiameter / 2);
        } else {
            if (!this.shiftIsPressed) {
                const mousePosition = this.getPositionFromMouse(event);
                this.endPoint = mousePosition;
            } else {
                // this.endPoint = this.angledEndPoint;
            }
            this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
            this.pushNewJunction(this.endPoint, this.currentDiameter / 2);
            this.drawJunction(this.drawingService.previewCtx, this.endPoint, this.currentDiameter / 2);
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
        if (this.lineHelper.pixelDistanceUtil(this.currentLine[0][0], mousePosition)) {
            this.endPoint = this.currentLine[0][0];
            this.currentLine.push([this.startingPoint, this.endPoint]);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.redrawCurrentBase();
        } else {
            if (!this.shiftIsPressed) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.endPoint = mousePosition;
                this.currentLine.push([this.startingPoint, this.endPoint]);
                this.junctions.push(this.endPoint);
                this.junctionsRadius.push(this.currentDiameter / 2);
                this.redrawCurrentBase();
            } else {
                this.endPoint = this.angledEndPoint;
                this.currentLine.push([this.startingPoint, this.endPoint]);
                this.junctions.push(this.endPoint);
                this.junctionsRadius.push(this.currentDiameter / 2);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.redrawCurrentBase();
            }
        }
        this.isStarted = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isStarted) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.endPoint = this.mousePosition;
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            if (this.shiftIsPressed) {
                this.endPoint = this.lineHelper.closestAngledPoint(this.startingPoint, this.endPoint);
                this.angledEndPoint = this.endPoint;
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.redrawCurrentPreview();
            this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.setColors(this.colorService);
        this.setStyles();

        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
        }
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.toolStyles.lineWidth;

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }
}
