import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { faEraser, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    startingPoint: Vec2;
    currentPoint: Vec2;
    coordinate: Vec2;
    indexValue: number = 3;
    minimumWidth: number = 5;
    icon: IconDefinition = faEraser;

    constructor(public drawingService: DrawingService) {
        super(drawingService);
        this.shortcut = 'e';
        this.localShortcuts = new Map();
        this.index = this.indexValue;
        this.toolStyles = {
            primaryColor: 'black',
            lineWidth: 5,
            secondaryColor: 'white',
        };
        this.drawingService = drawingService;
    }

    onMouseDown(mouseDownEvent: MouseEvent): void {
        this.mouseDown = mouseDownEvent.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(mouseDownEvent);
            this.startingPoint = this.mouseDownCoord;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx);
        }
    }

    onMouseUp(mouseUpEvent: MouseEvent): void {
        this.mouseDown = false;
    }

    findCoordinate(): Vec2 {
        const coord: Vec2 = { x: this.currentPoint.x - this.toolStyles.lineWidth / 2, y: this.currentPoint.y - this.toolStyles.lineWidth / 2 };
        return coord;
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.previewCtx.strokeStyle = 'black';
        this.drawingService.previewCtx.fillStyle = 'white';

        this.currentPoint = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.cursorEffect(this.findCoordinate());

        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.cursorEffect(this.findCoordinate());
        }
    }

    drawLine(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'black';
        ctx.beginPath();

        ctx.lineWidth = this.toolStyles.lineWidth;
        ctx.lineCap = 'square';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
        ctx.lineTo(this.currentPoint.x, this.currentPoint.y);
        ctx.stroke();

        this.startingPoint.x = this.currentPoint.x;
        this.startingPoint.y = this.currentPoint.y;
    }

    cursorEffect(location: Vec2): void {
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.fillRect(location.x, location.y, this.toolStyles.lineWidth, this.toolStyles.lineWidth);
        this.drawingService.previewCtx.strokeRect(location.x, location.y, this.toolStyles.lineWidth, this.toolStyles.lineWidth);
    }

    changeWidth(newWidth: number): void {
        if (this.isValid(newWidth)) {
            this.toolStyles.lineWidth = newWidth;
        } else {
            this.toolStyles.lineWidth = this.minimumWidth;
        }
    }

    isValid(width: number): boolean {
        if (width < this.minimumWidth) {
            return false;
        }
        return true;
    }
}
