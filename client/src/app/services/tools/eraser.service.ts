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
    baseWidht: number = 20;
    //pas le choix a cause de lint
    indexValue: number = 3;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortcut = 'e';
        this.localShortcuts = new Map();
        this.index = this.indexValue;
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

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.currentPoint = this.getPositionFromMouse(event);
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, [this.currentPoint]);
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineWidth = this.baseWidht;
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
        ctx.lineTo(this.currentPoint.x, this.currentPoint.y);
        ctx.stroke();
    }

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineWidth = this.baseWidht;
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
        ctx.lineTo(this.currentPoint.x, this.currentPoint.y);
        ctx.stroke();
    }
}
