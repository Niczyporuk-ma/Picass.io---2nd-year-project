import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tools/color.service';
import { SquareHelperService } from '@app/services/tools/square-helper.service';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    currentCommand: () => void;
    shiftIsPressed: boolean;
    currentLine: Vec2[] = [];
    eventListenerIsSet: boolean;
    contour: boolean = true;
    public icon = faSquare;
    constructor(drawingService: DrawingService, private squareHelperService: SquareHelperService, public colorService: ColorService) {
        super(drawingService);
        this.shortcut = '1';
        this.localShortcuts = new Map([['Shift', this.onShift]]);
        this.currentLine = [];
        this.index = 2;
        this.toolStyles = {
            primaryColor: 'rgba(255, 0, 0, 1)', // rouge
            lineWidth: 1,
            fill: false,
            secondaryColor: 'black',
        };
    }

    startingPoint: Vec2;
    endPoint: Vec2;

    clearArrays(): void {
        this.currentLine = [];
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPoint = this.mouseDownCoord;
        }
    }

    setShiftIfPressed = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            this.shiftIsPressed = true;
            if (!this.squareHelperService.checkIfIsSquare([this.startingPoint, this.endPoint])) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.currentLine = [this.startingPoint, this.squareHelperService.closestSquare([this.startingPoint, this.endPoint])];
                this.drawLine(this.drawingService.previewCtx, this.currentLine);
            }
        }
    };

    setShiftNonPressed = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            if (this.mouseDown) {
                this.shiftIsPressed = false;
                window.removeEventListener('keypress', this.setShiftIfPressed);
                window.removeEventListener('keyup', this.setShiftNonPressed);
                this.eventListenerIsSet = false;
                this.currentLine = [this.startingPoint, this.endPoint];
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.currentLine);
            } else {
                this.shiftIsPressed = false;
            }
        }
    };

    onShift(): void {
        if (!this.eventListenerIsSet) {
            window.addEventListener('keydown', this.setShiftIfPressed);
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.eventListenerIsSet = true;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (!this.shiftIsPressed) {
                const mousePosition = this.getPositionFromMouse(event);
                this.endPoint = mousePosition;
                this.currentLine = [this.startingPoint, this.endPoint];
                this.drawLine(this.drawingService.baseCtx, this.currentLine);
            } else {
                this.drawLine(this.drawingService.baseCtx, this.currentLine);
            }
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            if (this.shiftIsPressed) {
                if (this.squareHelperService.checkIfIsSquare([this.startingPoint, this.endPoint])) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.currentLine = [this.startingPoint, this.endPoint];
                    this.drawLine(this.drawingService.previewCtx, this.currentLine);
                } else {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.currentLine = [this.startingPoint, this.squareHelperService.closestSquare([this.startingPoint, this.endPoint])];
                    this.drawLine(this.drawingService.previewCtx, this.currentLine);
                }
            } else {
                // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.currentLine = [this.startingPoint, this.endPoint];
                this.drawLine(this.drawingService.previewCtx, this.currentLine);
            }
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.setColors(this.colorService);
        this.setStyles();

        this.drawingService.previewCtx.fillStyle = this.toolStyles.primaryColor as string;
        this.drawingService.baseCtx.fillStyle = this.toolStyles.primaryColor as string;

        this.drawingService.previewCtx.strokeStyle = this.toolStyles.secondaryColor as string;
        this.drawingService.baseCtx.strokeStyle = this.toolStyles.secondaryColor as string;

        if (!this.contour) {
            ctx.strokeStyle = this.colorService.primaryColor;
        }
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.toolStyles.lineWidth;
        ctx.lineCap = 'square';
        // path = this.currentLine;

        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
        }

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[0].y);

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[0].x, path[1].y);

        ctx.moveTo(path[0].x, path[1].y);
        ctx.lineTo(path[1].x, path[1].y);

        ctx.moveTo(path[1].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
        if (this.toolStyles.fill) {
            ctx.fillRect(path[0].x, path[0].y, path[1].x - path[0].x, path[1].y - path[0].y);
        }
    }
}
