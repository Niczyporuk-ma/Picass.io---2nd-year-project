import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    startingPoint: Vec2;
    currentPoint: Vec2;
    coordinate: Vec2;
    indexValue: number = 3;
    minimumWidth: number = 5;
    icon = faEraser;

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

    onMouseMove(event: MouseEvent): void {
        this.drawingService.previewCtx.strokeStyle = 'black';

        this.currentPoint = this.getPositionFromMouse(event);
        // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.cursorEffect(this.findCoordinate());

        if (this.mouseDown) {
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
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

    // Permet la previsualisation de notre efface
    cursorEffect(location: Vec2): void {
        this.toolStyles.lineWidth = 1;
        this.drawingService.previewCtx.strokeRect(location.x, location.y, this.toolStyles.lineWidth, this.toolStyles.lineWidth);
    }

    changeWidth(newWidth: number): void {
        if (this.isValid(newWidth)) {
            this.toolStyles.lineWidth = newWidth;
        } else {
            this.toolStyles.lineWidth = this.minimumWidth;
        }
    }

    // permet de verifier la limite de la largeur de l'efface
    isValid(width: number): boolean {
        return width > this.minimumWidth;
    }
}
