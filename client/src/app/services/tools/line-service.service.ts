import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from './pencil-service';

const POSSIBLE_ANGLES: number[] = [0, 45, 90, 135, 180, 225, 270, 315, 360];
const ANGLE_ADJUSTER_180 = 180;
const ANGLE_ADJUSTER_360 = 360;

@Injectable({
    providedIn: 'root',
})
export class LineServiceService extends Tool {
    shortcutToBeUsed: () => void;
    shiftIsPressed: boolean = false;
    private isStarted: boolean;
    private startingPoint: Vec2;
    private endPoint: Vec2;
    lineWidth: number;
    pixelDistance: number = 20;
    eventTest: boolean;
    line: Vec2[];
    pencilService: PencilService;

    constructor(drawingService: DrawingService, pencilService: PencilService) {
        super(drawingService);
        this.isStarted = false;
        this.shortcut = 'l';
        this.localShortcuts = new Map([
            ['Shift', this.onShift],
            ['Backspace', this.onBackspace],
            ['Escape', this.onEscape],
        ]);
        this.index = 1;
        this.pencilService = pencilService;
        this.styles = {
            lineColor: 'black',
            lineWidth: 20,
        };
    }

    localShortCutHandler(key: string): void {
        this.shortcutToBeUsed = this.localShortcuts.get(key) as () => void;
        this.shortcutToBeUsed();
    }

    onEscape(): void {
        this.isStarted = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onBackspace(): void {
        if (this.drawingService.drawingHistory.size > 0) {
            // let last = Array.from(this.drawingService.drawings)[this.drawingService.drawings.size - 1][0];
            // this.drawingService.drawings.delete(last);
            let index: number = Array.from(this.drawingService.drawingHistory).length - 1;
            let last = Array.from(this.drawingService.drawingHistory)[index][1];
            while (last !== this) {
                if (index > 0) {
                    console.log('test2');
                    last = Array.from(this.drawingService.drawingHistory)[--index][1];
                } else {
                    return;
                }
            }
            const lastLine = Array.from(this.drawingService.drawingHistory)[index][0];
            this.drawingService.drawingHistory.delete(lastLine);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            for (const entry of this.drawingService.drawingHistory.entries()) {
                entry[1].redrawLine(this.drawingService.baseCtx, entry[0]);
                // console.log('entry');
            }
            this.drawingService.pencilDrawings.forEach((item) => {
                this.pencilService.redrawLine(this.drawingService.baseCtx, item);
                // console.log('pencil');
            });
        }
    }

    setShiftIfPressed = () => {
        // if (e.key === 'Shift') {
        this.shiftIsPressed = true;
        if (!this.shiftAngleCalculator(this.startingPoint, this.endPoint) && this.isStarted) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const line: Vec2[] = [this.startingPoint, this.closestAngledPoint(this.startingPoint, this.endPoint)];
            this.drawLine(this.drawingService.previewCtx, line);
        }
        window.removeEventListener('keydown', this.setShiftIfPressed);
        this.eventTest = false;
        // }
    };

    setShiftNonPressed = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            this.shiftIsPressed = false;
            // console.log('false');
            // window.removeEventListener('keydown', this.setShiftIfPressed);
            window.removeEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = false;
            this.line = [this.startingPoint, this.endPoint];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.line);
        }
    };

    onShift(): void {
        if (!this.eventTest) {
            // window.addEventListener('keydown', this.setShiftIfPressed);
            this.setShiftIfPressed();
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = true;
        }
    }

    closestValidAngle(start: Vec2, end: Vec2): number {
        let closestValid = 999;

        const a: number = Math.abs(start.x - end.x);
        const b: number = Math.abs(start.y - end.y);
        let angle: number = Math.atan2(b, a) * (180 / Math.PI);
        angle = this.angleQuadrantConverter(start, end, angle);

        for (const angles of POSSIBLE_ANGLES) {
            if (Math.abs(angle - angles) < Math.abs(angle - closestValid)) {
                closestValid = angles;
            }
        }

        return closestValid;
    }

    closestAngledPoint(start: Vec2, end: Vec2): Vec2 {
        const closestAngle: number = this.closestValidAngle(start, end);
        const currentVectorMagnitude: number = this.distanceUtil(start, end);
        const toRadian = Math.PI / 180;
        const xCoord: number = start.x + currentVectorMagnitude * Math.cos(closestAngle * toRadian);
        const yCoord: number = start.y - currentVectorMagnitude * Math.sin(closestAngle * toRadian);

        const newLine: Vec2 = { x: xCoord, y: yCoord };

        return newLine;
    }

    distanceUtil(start: Vec2, end: Vec2): number {
        const a = Math.abs(start.x - end.x);
        const b = Math.abs(start.y - end.y);

        return Math.sqrt(a * a + b * b);
    }

    angleQuadrantConverter(start: Vec2, end: Vec2, angle: number): number {
        if (start.x <= end.x && start.y >= end.y) {
            angle = angle;
            return angle;
        } else if (start.x <= end.x && start.y <= end.y) {
            angle = ANGLE_ADJUSTER_360 - angle;
            return angle;
        } else if (start.x >= end.x && start.y >= end.y) {
            angle = ANGLE_ADJUSTER_180 - angle;
            return angle;
        } else {
            angle = angle + ANGLE_ADJUSTER_180;
            return angle;
        }
    }

    shiftAngleCalculator(start: Vec2, end: Vec2): boolean {
        const a: number = Math.abs(start.x - end.x);
        const b: number = Math.abs(start.y - end.y);
        let angle: number = Math.atan2(b, a) * (180 / Math.PI);

        angle = this.angleQuadrantConverter(start, end, angle);

        if (angle % 45 === 0) {
            return true;
        } else {
            return false;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            this.drawLine(this.drawingService.baseCtx, [this.startingPoint, this.endPoint]);
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
            this.drawLine(this.drawingService.baseCtx, [this.startingPoint, this.endPoint]);
            this.startingPoint = this.endPoint;
        }
    }

    onDoubleClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.pixelDistanceUtil(this.startingPoint, mousePosition)) {
            if (!this.shiftIsPressed) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                // this.drawLine(this.drawingService.baseCtx, [this.startingPoint, this.startingPoint]);
                // this.isStarted = false;
                this.onEscape();
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                const line: Vec2[] = [this.startingPoint, this.endPoint];
                this.drawLine(this.drawingService.baseCtx, line);
                return;
            }
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, [this.startingPoint, this.endPoint]);
            this.isStarted = false;
        }
    }

    pixelDistanceUtil(start: Vec2, end: Vec2): boolean {
        const a = Math.abs(start.x - end.x);
        const b = Math.abs(start.y - end.y);

        return a <= this.pixelDistance && b <= this.pixelDistance;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isStarted) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            if (this.shiftIsPressed) {
                if (this.shiftAngleCalculator(this.startingPoint, this.endPoint)) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    const line: Vec2[] = [this.startingPoint, this.endPoint];
                    this.drawLine(this.drawingService.previewCtx, line);
                }
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                const line: Vec2[] = [this.startingPoint, this.endPoint];
                this.drawLine(this.drawingService.previewCtx, line);
            }
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
            this.drawingService.drawingHistory.set(path, this);
        }
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.styles.lineWidth;

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.styles.lineWidth;

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }
}
