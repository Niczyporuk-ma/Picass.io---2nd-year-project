import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SquareHelperService } from '@app/services/tools/square-helper.service';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { ColorService } from './color.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    startingPoint: Vec2;
    endPoint: Vec2;
    shiftIsPressed: boolean;
    currentLine: Vec2[] = [];
    border: boolean = true;
    eventTest: boolean;
    icon = faCircle;

    constructor(drawingService: DrawingService, private squareHelperService: SquareHelperService, public colorService: ColorService) {
        super(drawingService);
        this.shortcut = '2';
        this.index = 4;
        this.localShortcuts = new Map([['Shift', this.onShift]]);
        this.toolStyles = {
            primaryColor: 'white',
            lineWidth: 1,
            fill: false,
            secondaryColor: 'black',
        };
    }

    clearArrays(): void {
        this.currentLine = [];
    }

    // TODO: (BUG) circle est dessinee hors du carre (lorsquon appuie sur le shift) mais seulement
    // quand on dessine du bas vers le haut, et de droite vers la gauche

    // TODO: renommer eventTest
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
                this.drawRectangle(
                    this.drawingService.previewCtx,
                    this.startingPoint,
                    this.squareHelperService.closestSquare([this.startingPoint, this.endPoint]),
                );
            }
        }
    }

    setShiftNonPressed = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            if (this.mouseDown) {
                this.shiftIsPressed = false;
                window.removeEventListener('keypress', this.setShiftIfPressed);
                window.removeEventListener('keyup', this.setShiftNonPressed);
                this.eventTest = false;
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
            } else {
                this.shiftIsPressed = false;
            }
        }
    }

    onMouseDown(event: MouseEvent): void {
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
            // this.drawRectangle(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
            this.drawEllipse(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
            if (this.shiftIsPressed) {
                this.drawRectangle(
                    this.drawingService.previewCtx,
                    this.startingPoint,
                    this.squareHelperService.closestSquare([this.startingPoint, this.endPoint]),
                );
            } else {
                this.drawRectangle(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
            }
        }
    }

    drawRectangle(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        const gapBetweenDash = 5;
        const dashLength = 5;
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        ctx.globalCompositeOperation = 'source-over';
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
        ctx.setLineDash([]);
    }

    drawEllipse(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        this.setColors(this.colorService);
        this.setStyles();

        this.drawingService.previewCtx.fillStyle = this.toolStyles.primaryColor as string;
        this.drawingService.baseCtx.fillStyle = this.toolStyles.primaryColor as string;

        this.drawingService.previewCtx.strokeStyle = this.toolStyles.secondaryColor as string;
        this.drawingService.baseCtx.strokeStyle = this.toolStyles.secondaryColor as string;

        if (!this.border) {
            ctx.strokeStyle = this.colorService.primaryColor;
        }

        ctx.globalCompositeOperation = 'source-over';
        const width = end.y - start.y;
        const height = end.x - start.x;
        const radiusX = width / 2;
        const radiusY = height / 2;

        ctx.beginPath();
        ctx.setLineDash([]);

        if (this.shiftIsPressed) {
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

        // TODO: ecrire les tests pour ca
        if (this.toolStyles.fill) {
            ctx.setLineDash([]);
            ctx.fill();
        }
        ctx.stroke();
    }
}
