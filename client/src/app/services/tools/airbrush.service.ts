import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tools/color.service';

const TOOL_INDEX = 5;
const INITIAL_JET_DIAMETER = 20;
const INITIAL_DROPLET_DIAMETER = 1;
const INITIAL_EMISSION_RATE = 30; //number of droplets shooting per a unit of time

@Injectable({
    providedIn: 'root',
})
export class AirbrushService extends Tool {
    private pathData: Vec2[];
    jetDiameter: number = INITIAL_JET_DIAMETER;
    dropletDiameter: number = INITIAL_DROPLET_DIAMETER;
    emissionRate: number = INITIAL_EMISSION_RATE;
    timerID: number;

    constructor(drawingService: DrawingService, public colorService: ColorService) {
        super(drawingService);
        this.index = TOOL_INDEX;
        this.shortcut = 'a';
        this.localShortcuts = new Map();
        this.toolStyles = {
            primaryColor: 'black',
            lineWidth: this.jetDiameter,
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
            //To imitate the effect of spraying constantly as long as the mouse button is down... Spraying every 100ms!
            this.timerID = window.setInterval(() => {
                this.spray(this.drawingService.baseCtx, this.mouseDownCoord);
            }, 100);
        }
    }

    onMouseMove(mouseMoveEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(mouseMoveEvent);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.spray(this.drawingService.baseCtx, this.mouseDownCoord);
        }
    }

    onMouseUp(mouseUpEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive) {
            const mousePosition = this.getPositionFromMouse(mouseUpEvent);
            this.pathData.push(mousePosition);
            window.clearInterval(this.timerID);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    spray(ctx: CanvasRenderingContext2D, point: Vec2): void {
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
        const clientX = point.x;
        const clientY = point.y;
        const dropletRadius = this.dropletDiameter / 2;

        for (const point of this.pathData) {
            ctx.beginPath();
            this.drawingService.baseCtx.fillStyle = this.toolStyles.primaryColor as string;
            ctx.arc(point.x, point.y, dropletRadius / 2, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Creating
        for (let i = this.emissionRate; i--; ) {
            const randomAngle = this.getRandomNumber(0, Math.PI * 2);
            const randomRadius = this.getRandomNumber(0, this.jetDiameter / 2);
            const dropletCenter: Vec2 = { x: clientX + randomRadius * Math.cos(randomAngle), y: clientY + randomRadius * Math.sin(randomAngle) };
            this.drawingService.baseCtx.fillStyle = this.toolStyles.primaryColor as string;
            ctx.beginPath();
            ctx.arc(dropletCenter.x, dropletCenter.y, dropletRadius, randomAngle, randomAngle + 2 * Math.PI);
            ctx.fill();
            this.pathData.push(dropletCenter);
        }
    }

    private getRandomNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}
