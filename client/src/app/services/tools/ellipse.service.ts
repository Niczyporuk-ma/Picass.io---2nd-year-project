import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from './color.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService);
        this.shortcut = '2';
        this.localShortcuts = new Map([['Shift', this.onShift]]);
        this.colorService = colorService;
    }

    private startingPoint: Vec2;
    private endPoint: Vec2;
    private lineWidth: number;
    public fill = false;
    public border = false;
    private colorService: ColorService;
    private primaryColor: string;
    // private secondaryColor: string;

    shiftIsPressed: boolean;
    eventTest: boolean;
    currentLine: Vec2[] = [];

    onShift(): void {
        if (!this.eventTest) {
            window.addEventListener('keydown', this.setShiftIfPressed);
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = true;
        }
    }
    setShiftIfPressed = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            this.shiftIsPressed = true;
            if (!this.checkIfIsSquare([this.startingPoint, this.endPoint])) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.currentLine = [this.startingPoint, this.closestSquare([this.startingPoint, this.endPoint])];
                //might cause problems
                this.drawEllipse(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
                this.drawRectangle(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
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
                //might cause problems
                // this.drawingService.clearCanvas(this.drawingService.previewCtx);
            } else {
                this.shiftIsPressed = false;
            }
        }
    };

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

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPoint = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.baseCtx, this.startingPoint, this.endPoint);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
            this.drawEllipse(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
        }
    }
    private drawRectangle(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;
        //ctx.lineCap = 'round';
        ctx.setLineDash([5, 5]);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, start.y);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(start.x, end.y);
        ctx.moveTo(start.x, end.y);
        ctx.lineTo(end.x, end.y);
        ctx.moveTo(end.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        var width = end.y - start.y;
        var height = end.x - start.x;
        const radiusX = width / 2;
        const radiusY = height / 2;

        ctx.beginPath();
        ctx.setLineDash([]);

        if (this.shiftIsPressed) {
            //this.drawCircle(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
            ctx.ellipse(
                start.x + Math.min(Math.abs(radiusX), radiusY),
                start.y + Math.min(radiusX, Math.abs(radiusY)),
                Math.abs(Math.min(Math.abs(radiusX), Math.abs(radiusY))),
                Math.abs(Math.min(Math.abs(radiusX), Math.abs(radiusY))),
                Math.PI / 2,
                0,
                2 * Math.PI,
            );
        } else {
            ctx.ellipse(start.x + radiusY, start.y + radiusX, Math.abs(radiusX), Math.abs(radiusY), Math.PI / 2, 0, 2 * Math.PI);
        }

        if (this.border) {
            ctx.strokeStyle = 'red'; //secondary color
            this.primaryColor = this.colorService.primaryColor;
            //TODO this.secondaryColor = this.colorService.secondaryColor;
        } else {
            this.primaryColor = this.colorService.primaryColor;
            ctx.strokeStyle = this.primaryColor; //primary color
        }

        if (this.fill) {
            ctx.setLineDash([]);
            //ctx.ellipse(start.x + radiusY, start.y + radiusX, Math.abs(radiusX), Math.abs(radiusY), Math.PI / 2, 0, 2 * Math.PI);
            ctx.fillStyle = this.primaryColor; //primary color
            ctx.fill();
        }

        ctx.stroke();
    }
}
