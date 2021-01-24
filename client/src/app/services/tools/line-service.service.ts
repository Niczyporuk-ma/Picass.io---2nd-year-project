import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { faSlash } from '@fortawesome/free-solid-svg-icons';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class LineServiceService extends Tool {
    private startingPoint: Vec2;
    private endPoint: Vec2;
    public lineWidth: number;
    public ID: number = 1;
    public icon = faSlash;
    //public toolManager: ToolManagerService;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        //this.toolManager = toolManager;
        //this.clearPath();
    }

    // setCurrent(): void {
    //     this.toolManager.setLineService();
    // }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            //this.clearPath();

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
        //this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        //ctx.lineCap = 'round';

        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    // private clearPath(): void {
    //     this.pathData = [];
    // }
}
