import { Injectable } from '@angular/core';
import { Tool, ToolStyles } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareHelperService } from '@app/services/tools/square-helper.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    shiftIsPressed: boolean;
    currentLine: Vec2[] = [];
    eventListenerIsSet: boolean;
    constructor(drawingService: DrawingService, private squareHelperService: SquareHelperService) {
        super(drawingService);
        this.shortcut = '1';
        this.localShortcuts = new Map([['Shift', this.onShift]]);
        this.drawingService.drawingHistory = new Map([]);
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

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPoint = this.mouseDownCoord;
        }
    }
    changeWidth(newWidth: number): void {
        this.toolStyles.lineWidth = newWidth;
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
                // this.drawingService.previewCtx.strokeStyle = 'black';
                // this.drawingService.previewCtx.strokeRect(
                //     this.startingPoint.x,
                //     this.startingPoint.y,
                //     this.endPoint.x - this.startingPoint.x,
                //     this.endPoint.y - this.startingPoint.y,
                // );
            }
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.setStyles();
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.toolStyles.lineWidth;
        // ctx.lineCap = 'round';
        path = this.currentLine;

        if (ctx === this.drawingService.baseCtx) {
            // let test: ToolStyles = { ...this.styles };
            this.drawingService.drawingHistory.set(path, [this, { ...this.toolStyles }]);
            //console.log(this.styles);
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

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[], style: ToolStyles): void {
        this.toolStyles = style;
        this.setStyles();
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';

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

    // changeWidth(newWidth: number): void {
    //     //this.lastWidth = this.currentWidth;
    //     // this.penWidth = parseInt(newWidth);
    //     this.styles.lineWidth = newWidth;
    // }

    // isValid(width: number): boolean {
    //     return true;
    // }
}
