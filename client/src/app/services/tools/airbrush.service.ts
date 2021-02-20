import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tools/color.service';

const TOOL_INDEX = 5;

@Injectable({
    providedIn: 'root',
})
export class AirbrushService extends Tool {
    private pathData: Vec2[];

    constructor(drawingService: DrawingService, public colorService: ColorService) {
        super(drawingService);
        this.index = TOOL_INDEX;
        this.shortcut = 'A';
        this.toolStyles = {
            primaryColor: 'black',
            lineWidth: 5,
        };
    }
    private clearPath(): void {
        this.pathData = [];
    }

    onMouseDown(mouseDownEvent: MouseEvent): void {
        this.mouseDown = mouseDownEvent.button === MouseButton.Left;
        if (this.mouseDown && !this.drawingService.resizeActive) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(mouseDownEvent);
            this.pathData.push(this.mouseDownCoord);
            this.spray(this.drawingService.baseCtx, this.pathData);
        }
    }

    onMouseMove(mouseMoveEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive) {
            const mousePosition = this.getPositionFromMouse(mouseMoveEvent);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.spray(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseUp(mouseUpEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive) {
            const mousePosition = this.getPositionFromMouse(mouseUpEvent);
            this.pathData.push(mousePosition);
            this.spray(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    spray(ctx: CanvasRenderingContext2D, path: Vec2[]) {
        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
        }
        this.setColors(this.colorService);
        this.setStyles();

        ctx.beginPath();
        ctx.lineWidth = this.toolStyles.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round'; //try other options
        ctx.globalCompositeOperation = 'source-over';
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        //useful stuff
        //   ctx.arc(
        //     (this.startingPoint.x + squareCornerPos.x) / 2,
        //     (this.startingPoint.y + squareCornerPos.y) / 2,
        //     Math.abs((this.startingPoint.x - squareCornerPos.x) / 2),
        //     0,
        //     2 * Math.PI,
        // );
    }
}
