import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareHelperService } from '@app/services/tools/square-helper.service';
import { ColorService } from './color.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    constructor(drawingService: DrawingService, private squareHelperService: SquareHelperService, public colorService: ColorService) {
        super(drawingService);
        this.shortcut = '2';
        this.localShortcuts = new Map([['Shift', this.onShift]]);
        // this.colorService = colorService;
        this.toolStyles = {
            primaryColor: 'black',
            lineWidth: 1,
            fill: false,
            secondaryColor: 'white',
        };
    }

    private startingPoint: Vec2;
    private endPoint: Vec2;
    // private lineWidth: number;
    border: boolean = false;
    // private colorService: ColorService;
    // private primaryColor: string;
    // private secondaryColor: string;

    shiftIsPressed: boolean;
    eventTest: boolean;
    currentLine: Vec2[] = [];

    //TODO: renommer eventTest
    onShift(): void {
        if (!this.eventTest) {
            window.addEventListener('keydown', this.setShiftIfPressed);
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = true;
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
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            } else {
                this.shiftIsPressed = false;
            }
        }
    };

    onMouseDown(event: MouseEvent): void {
        //TODO: gestion de MouseDown pour tous les tools (mettre dans l'interface)
        this.mouseDown = event.button === MouseButton.Left;
        if (!this.mouseDown) {
            return;
        }
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.startingPoint = this.mouseDownCoord;
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

    //TODO: fix the dashline
    public drawRectangle(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        const gapBetweenDash = 5;
        const dashLength = 5;
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.globalCompositeOperation = 'source-over';
        // ctx.lineCap = 'round';
        ctx.setLineDash([dashLength, gapBetweenDash]);
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

    public drawEllipse(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        this.setColors(this.colorService);
        this.setStyles();
        if (!this.border) {
            ctx.strokeStyle = 'white';
        }
        if (!this.toolStyles.fill) {
            ctx.fillStyle = 'white';
        }
        ctx.globalCompositeOperation = 'source-over';
        const width = end.y - start.y;
        const height = end.x - start.x;
        const radiusX = width / 2;
        const radiusY = height / 2;

        // this.primaryColor = this.colorService.primaryColor;
        // this.secondaryColor = this.colorService.secondaryColor;

        ctx.beginPath();
        ctx.setLineDash([]);

        if (this.shiftIsPressed) {
            // this.drawCircle(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
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

        //TODO: fix border & fill + fait les tests respectifs

        // if (this.toolStyles.fill) {
        //     ctx.setLineDash([]);
        //     ctx.fillStyle = this.toolStyles.primaryColor;
        //     ctx.fill();
        // }
        ctx.stroke();
        ctx.fill();
    }
}
