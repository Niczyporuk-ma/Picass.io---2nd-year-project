import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    shiftIsPressed: boolean;
    currentLine: Vec2[] = [];
    eventTest: boolean;
    fill: boolean = false;
    contour: boolean = false;
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortcut = '1';
        this.localShortcuts = new Map([['Shift', this.onShift]]);
    }

    private startingPoint: Vec2;
    private endPoint: Vec2;
    private lineWidth: number;

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
            if (!this.checkIfIsSquare([this.startingPoint, this.endPoint])) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.currentLine = [this.startingPoint, this.closestSquare([this.startingPoint, this.endPoint])];
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
                this.eventTest = false;
                this.currentLine = [this.startingPoint, this.endPoint];
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.currentLine);
            } else {
                this.shiftIsPressed = false;
            }
        }
    };

    onShift(): void {
        if (!this.eventTest) {
            window.addEventListener('keydown', this.setShiftIfPressed);
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = true;
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

    checkIfIsSquare(pos: Vec2[]): boolean {
        const horizontalDistance: number = pos[0].x - pos[1].x;
        const verticalDistance: number = pos[0].y - pos[1].y;

        if (horizontalDistance === verticalDistance) {
            return true;
        } else {
            return false;
        }
    }

    closestSquare(pos: Vec2[]): Vec2 {
        const horizontalDistance: number = Math.abs(pos[0].x - pos[1].x);
        const verticalDistance: number = Math.abs(pos[0].y - pos[1].y);
        const isLeft: boolean = pos[0].x > pos[1].x;
        const isDownward: boolean = pos[0].y > pos[1].y;

        const smallest = Math.min(horizontalDistance, verticalDistance);

        if (smallest === horizontalDistance) {
            const newPos: Vec2 = { x: pos[1].x, y: isDownward ? pos[0].y - horizontalDistance : pos[0].y + horizontalDistance };
            return newPos;
        } else {
            const newPos: Vec2 = { x: isLeft ? pos[0].x - verticalDistance : pos[0].x + verticalDistance, y: pos[1].y };
            return newPos;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            if (this.shiftIsPressed) {
                if (this.checkIfIsSquare([this.startingPoint, this.endPoint])) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.currentLine = [this.startingPoint, this.endPoint];
                    this.drawLine(this.drawingService.previewCtx, this.currentLine);
                } else {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.currentLine = [this.startingPoint, this.closestSquare([this.startingPoint, this.endPoint])];
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
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;
        // ctx.lineCap = 'round';

        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingHistory.set(path, this);
            this.drawingService.drawingStarted = true;
        }

        if (this.contour) {
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 20;
        } else {
            ctx.strokeStyle = 'white';
        }

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[0].y);
        // let currentLine: Vec2[] = [path[0], { x: path[1].x, y: path[0].y }];
        // this.drawingService.drawings.set(currentLine, this);

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[0].x, path[1].y);
        // currentLine = [path[0], { x: path[0].x, y: path[1].y }];
        // this.drawingService.drawings.set(currentLine, this);

        ctx.moveTo(path[0].x, path[1].y);
        ctx.lineTo(path[1].x, path[1].y);
        // currentLine = [
        //     { x: path[0].x, y: path[1].y },
        //     { x: path[1].x, y: path[1].y },
        // ];
        // this.drawingService.drawings.set(currentLine, this);

        ctx.moveTo(path[1].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        // currentLine = [{ x: path[1].x, y: path[0].y }, path[1]];
        // this.drawingService.drawings.set(currentLine, this);
        ctx.stroke();
        if (this.fill) {
            ctx.fillStyle = 'red';
            ctx.fillRect(path[0].x, path[0].y, path[1].x - path[0].x, path[1].y - path[0].y);
        } else {
            ctx.fillStyle = 'white';
        }
    }

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;
        // ctx.lineCap = 'round';

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[0].y);

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[0].x, path[1].y);

        ctx.moveTo(path[0].x, path[1].y);
        ctx.lineTo(path[1].x, path[1].y);

        ctx.moveTo(path[1].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);

        ctx.stroke();
    }
}
