import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    laspoint: Vec2;
    nexpoint: Vec2;
    private pathData: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.shortcut = 'p';
        this.localShortcuts = new Map([['Shift', this.test]]);
        this.index = 0;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    test(): void {
        alert('gg sa fonctionne, sah quel plaisir');
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    changeColorBlue(): void {
        this.drawingService.baseCtx.strokeStyle = 'blue';
    }

    changeWidth(newWidth: number): void {
        this.lastWidth = this.currentWidth;
        // this.penWidth = parseInt(newWidth);
        this.currentWidth = newWidth;
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
        }
        ctx.beginPath();
        ctx.lineWidth = this.currentWidth;
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'source-over';
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
            /* if (index !== 0) {
                const start: Vec2 = path[index - 1];
                const end: Vec2 = path[index];
                const line: Vec2[] = [start, end];
               // this.drawingService.pencilDrawings.push(line);
            }*/
        }
        ctx.stroke();
    }
    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'source-over';
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
