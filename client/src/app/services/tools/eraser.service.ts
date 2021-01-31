import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private startingPoint: Vec2;
    private currentPoint: Vec2;
    topLeftCorner: Vec2;
    indexValue: number = 3;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortcut = 'e';
        this.localShortcuts = new Map();
        this.index = this.indexValue;
        this.styles = {
            lineColor: 'black',
            lineWidth: 20,
        };
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPoint = this.mouseDownCoord;
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
    }

    findTopLeftCorner(): Vec2 {
        const coord: Vec2 = { x: this.currentPoint.x - this.styles.lineWidth / 2, y: this.currentPoint.y - this.styles.lineWidth / 2 };
        return coord;
    }

    onMouseMove(event: MouseEvent): void {
        this.currentPoint = this.getPositionFromMouse(event);
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.topLeftCorner = this.findTopLeftCorner();
        this.cursorEffect(this.drawingService.previewCtx, this.topLeftCorner);

        if (this.mouseDown) {
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, [this.currentPoint]);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.topLeftCorner = this.findTopLeftCorner();
            this.cursorEffect(this.drawingService.previewCtx, this.topLeftCorner);
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();

        ctx.lineWidth = this.styles.lineWidth;
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
        ctx.lineTo(this.currentPoint.x, this.currentPoint.y);
        ctx.stroke();

        this.startingPoint.x = this.currentPoint.x;
        this.startingPoint.y = this.currentPoint.y;
    }

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineWidth = this.styles.lineWidth;
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
        ctx.lineTo(this.currentPoint.x, this.currentPoint.y);
        ctx.stroke();
    }

    cursorEffect(ctx: CanvasRenderingContext2D, location: Vec2): void {
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.strokeRect(location.x, location.y, this.styles.lineWidth, this.styles.lineWidth);
    }
}
