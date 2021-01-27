import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { DrawingService } from '../drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private startingPoint: Vec2;
    private currentPoint: Vec2;
    icon = faEraser;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortcut = 'e';
        this.localShortcuts = new Map();
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
            this.drawLine(this.drawingService.baseCtx, this.currentPoint);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2): void {
        ctx.beginPath();
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
        ctx.lineTo(this.currentPoint.x, this.currentPoint.y);
        ctx.stroke();
    }
}
