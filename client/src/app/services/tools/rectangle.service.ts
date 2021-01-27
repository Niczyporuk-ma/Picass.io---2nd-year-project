import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortcut = 'r';
        this.localShortcut = new Map();
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

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            let line: Vec2[] = [this.startingPoint, this.endPoint];
            this.drawLine(this.drawingService.baseCtx, line);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            let line: Vec2[] = [this.startingPoint, this.endPoint];
            this.drawLine(this.drawingService.previewCtx, line);
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;
        //ctx.lineCap = 'round';

        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawings.set(path, this);
        }

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[0].y);
        // let line: Vec2[] = [path[0], { x: path[1].x, y: path[0].y }];
        // this.drawingService.drawings.set(line, this);

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[0].x, path[1].y);
        // line = [path[0], { x: path[0].x, y: path[1].y }];
        // this.drawingService.drawings.set(line, this);

        ctx.moveTo(path[0].x, path[1].y);
        ctx.lineTo(path[1].x, path[1].y);
        // line = [
        //     { x: path[0].x, y: path[1].y },
        //     { x: path[1].x, y: path[1].y },
        // ];
        // this.drawingService.drawings.set(line, this);

        ctx.moveTo(path[1].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        // line = [{ x: path[1].x, y: path[0].y }, path[1]];
        // this.drawingService.drawings.set(line, this);
        ctx.stroke();
    }

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;
        //ctx.lineCap = 'round';

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

    getShorcutValue(): string {
        return this.shortcut;
    }

    getLocalShorcuts(): Map<string, Function> {
        return this.localShortcut;
    }
}
