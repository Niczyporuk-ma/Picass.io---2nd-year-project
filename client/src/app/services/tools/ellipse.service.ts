import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortcut = '2';
        this.localShortcut = new Map();
    }

    private startingPoint: Vec2;
    private endPoint: Vec2;
    private lineWidth: number;
    public icon = faCircle;

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
            this.drawLine(this.drawingService.baseCtx, this.startingPoint, this.endPoint);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
            this.drawLine(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
        }
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        ctx.beginPath();
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

    private drawLine(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        var width = end.y - start.y;
        var height = end.x - start.x;
        const radiusX = width / 2;
        const radiusY = height / 2;

        //ellipse
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.ellipse(start.x + radiusY, start.y + radiusX, Math.abs(radiusX), Math.abs(radiusY), Math.PI / 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    getShorcutValue(): string {
        return this.shortcut;
    }

    getLocalShorcuts(): Map<string, Function> {
        return this.localShortcut;
    }
}
