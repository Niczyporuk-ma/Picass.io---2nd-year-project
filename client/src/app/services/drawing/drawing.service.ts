import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    resizeActive: boolean = false;
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    drawingStarted: boolean = false;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
