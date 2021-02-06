import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    startingPoint: Vec2;
    currentPoint: Vec2;
    coordinate: Vec2;
    indexValue: number = 3;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortcut = 'e';
        this.localShortcuts = new Map();
        this.index = this.indexValue;
        this.toolStyles = {
            lineColor: 'black',
            lineWidth: 5,
            fillColor: 'white',
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

    // Permet de trouver la bonne prosition pour l'effet du curseur
    findCoordinate(): Vec2 {
        const coord: Vec2 = { x: this.currentPoint.x - this.toolStyles.lineWidth / 2, y: this.currentPoint.y - this.toolStyles.lineWidth / 2 };
        return coord;
    }
    changeWidth(newWidth: number): void {
        this.toolStyles.lineWidth = newWidth;
    }

    onMouseMove(event: MouseEvent): void {
        this.currentPoint = this.getPositionFromMouse(event);
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.coordinate = this.findCoordinate();
        this.cursorEffect(this.drawingService.previewCtx, this.coordinate);

        if (this.mouseDown) {
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, [this.currentPoint]);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.coordinate = this.findCoordinate();
            this.cursorEffect(this.drawingService.previewCtx, this.coordinate);
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
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

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.lineWidth = this.toolStyles.lineWidth;
        ctx.lineCap = 'round';
        ctx.globalCompositeOperation = 'destination-out';
        ctx.moveTo(this.startingPoint.x, this.startingPoint.y);
        ctx.lineTo(this.currentPoint.x, this.currentPoint.y);
        ctx.stroke();
    }

    // Permet la previsualisation de notre efface
    cursorEffect(ctx: CanvasRenderingContext2D, location: Vec2): void {
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.strokeRect(location.x, location.y, this.toolStyles.lineWidth, this.toolStyles.lineWidth);
    }

    // changeWidth(newWidth: number): void {
    //     //this.lastWidth = this.currentWidth;
    //     // this.penWidth = parseInt(newWidth);
    //     this.styles.lineWidth = newWidth;
    // }

    // isValid(width: number): boolean {
    //     if (width < 5) {
    //         return false;
    //     }

    //     return true;
    // }
}
