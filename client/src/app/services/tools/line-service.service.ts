import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { faSlash } from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class LineServiceService extends Tool {
    private isStarted: boolean;
    private startingPoint: Vec2;
    private endPoint: Vec2;
    private lineWidth: number;
    public icon = faSlash;
    localShortcut = new Map([
        ['Shift', this.onShift],
        ['p', this.onP],
        ['n', this.onN],
    ]);

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.isStarted = false;
        this.shortcut = 'l';
    }

    onP(): void {
        console.log('pressed p');
    }

    onN(): void {
        console.log('pressed n');
    }

    onShift(): void {
        console.log('test');
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            this.drawLine(this.drawingService.baseCtx, this.startingPoint, this.endPoint);
        }
        this.mouseDown = false;
    }

    onMouseClick(event: MouseEvent): void {
        if (!this.isStarted) {
            this.isStarted = true;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPoint = this.mouseDownCoord;
        } else {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            this.drawLine(this.drawingService.baseCtx, this.startingPoint, this.endPoint);
            this.startingPoint = this.endPoint;
        }
    }

    onDoubleClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.distanceUtil(this.startingPoint, mousePosition)) {
            this.isStarted = false;
        } else {
            this.drawLine(this.drawingService.baseCtx, this.startingPoint, this.endPoint);
            this.isStarted = false;
        }
    }

    distanceUtil(start: Vec2, end: Vec2): boolean {
        var a = start.x - end.x;
        var b = start.y - end.y;

        return a <= 20 && b <= 20;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isStarted) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;

        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    getShorcutValue(): string {
        return this.shortcut;
    }

    getLocalShorcuts(): Map<string, Function> {
        return this.localShortcut;
    }


}
