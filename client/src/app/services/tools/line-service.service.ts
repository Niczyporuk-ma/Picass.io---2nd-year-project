import { Injectable } from '@angular/core';
import { Tool, ToolStyles } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from './pencil-service';

const angleNull = 0;
const angle45 = 45;
const angleCarre = 90;
const angle135 = 135;
const angle180 = 180;
const angle225 = 225;
const angle270 = 270;
const angle315 = 315;
const angle360 = 360;
const anglePlat = 180;
const POSSIBLE_ANGLES: number[] = [angleNull, angle45, angleCarre, angle135, angle180, angle225, angle270, angle315, angle360];
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
    currentSegment: Vec2[] = [];
    currentLine: Vec2[][] = [];
    pencilService: PencilService;
    styles: ToolStyles;
    angledEndPoint: Vec2;

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
        this.styles = { lineColor: 'blue', lineWidth: 5 };
    }

    localShortCutHandler(key: string): void {
        this.shortcutToBeUsed = this.localShortcuts.get(key) as () => void;
        this.shortcutToBeUsed();
    }

    onEscape(): void {
        this.isStarted = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.currentLine = [];
    }

    onBackspace(): void {
        if (this.drawingService.drawingHistory.size > 0) {
            // let last = Array.from(this.drawingService.drawings)[this.drawingService.drawings.size - 1][0];
            // this.drawingService.drawings.delete(last);
            let index: number = Array.from(this.drawingService.drawingHistory).length - 1;
            let last = Array.from(this.drawingService.drawingHistory)[index][1][0];
            while (last !== this) {
                if (index > 0) {
                    last = Array.from(this.drawingService.drawingHistory)[--index][1][0];
                } else {
                    return;
                }
            }
            const lastLine = Array.from(this.drawingService.drawingHistory)[index][0];
            this.drawingService.drawingHistory.delete(lastLine);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            for (const entry of this.drawingService.drawingHistory.entries()) {
                entry[1][0].redrawLine(this.drawingService.baseCtx, entry[0], entry[1][1]);
                console.log(entry);
            }
            this.drawingService.pencilDrawings.forEach((item) => {
                this.pencilService.redrawLine(this.drawingService.baseCtx, item);
                // console.log('pencil');
            });
        }
    }

    setShiftIfPressed = () => {
        this.shiftIsPressed = true;
        if (!this.shiftAngleCalculator(this.startingPoint, this.endPoint) && this.isStarted) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.redrawCurrentPreview();
            const line: Vec2[] = [this.startingPoint, this.closestAngledPoint(this.startingPoint, this.endPoint)];
            this.angledEndPoint = line[1];
            this.drawLine(this.drawingService.previewCtx, line);
        }
        window.removeEventListener('keydown', this.setShiftIfPressed);
        this.eventTest = false;
    };

    setShiftNonPressed = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            this.shiftIsPressed = false;
            window.removeEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = false;
            if (this.isStarted) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.redrawCurrentPreview();
                this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
            }
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
        let angle: number = Math.atan2(b, a) * (anglePlat / Math.PI);
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
        const toRadian = Math.PI / anglePlat;
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
        let angle: number = Math.atan2(b, a) * (anglePlat / Math.PI);

        angle = this.angleQuadrantConverter(start, end, angle);

        if (angle % angle45 === 0) {
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

    redrawCurrentPreview(): void {
        for (const line of this.currentLine) {
            this.drawLine(this.drawingService.previewCtx, line);
        }
    }
    redrawCurrentBase(): void {
        for (const line of this.currentLine) {
            this.drawLine(this.drawingService.baseCtx, line);
        }
        this.currentLine = [];
    }

    onMouseClick(event: MouseEvent): void {
        if (!this.isStarted) {
            this.isStarted = true;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPoint = this.mouseDownCoord;
        } else {
            if (!this.shiftIsPressed) {
                const mousePosition = this.getPositionFromMouse(event);
                this.endPoint = mousePosition;
            } else {
                this.endPoint = this.angledEndPoint;
            }
            this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
            this.currentLine.push([this.startingPoint, this.endPoint]);
            this.startingPoint = this.endPoint;
        }
    }

    onDoubleClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        console.log(this.shiftIsPressed);
        if (this.pixelDistanceUtil(this.startingPoint, mousePosition)) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // this.drawLine(this.drawingService.baseCtx, line);
            this.redrawCurrentBase();
            return;
        } else {
            if (!this.shiftIsPressed) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.endPoint = mousePosition;
                this.currentLine.push([this.startingPoint, this.endPoint]);
                // this.drawLine(this.drawingService.baseCtx, [this.startingPoint, this.endPoint]);
                this.redrawCurrentBase();
            } else {
                this.endPoint = this.angledEndPoint;
                this.currentLine.push([this.startingPoint, this.endPoint]);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.redrawCurrentBase();
            }
        }
        this.isStarted = false;
    }

    pixelDistanceUtil(start: Vec2, end: Vec2): boolean {
        const distanceHorizontale = Math.abs(start.x - end.x);
        const distanceVerticale = Math.abs(start.y - end.y);

        return distanceHorizontale <= this.pixelDistance && distanceVerticale <= this.pixelDistance;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isStarted) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            if (this.shiftIsPressed) {
                if (this.shiftAngleCalculator(this.startingPoint, this.endPoint)) {
                    this.angledEndPoint = this.endPoint;
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.redrawCurrentPreview();
                    this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
                }
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.redrawCurrentPreview();
                this.drawLine(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
            }
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.setStyles();

        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
            // let test: ToolStyles = { ...this.styles };
            this.drawingService.drawingHistory.set(path, [this, { ...this.styles }]);
        }
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.styles.lineWidth;

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[], style: ToolStyles): void {
        this.styles = style;
        this.setStyles();
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.styles.lineWidth;

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }

    // changeWidth(newWidth: number): void {
    //     //this.lastWidth = this.currentWidth;
    //     // this.penWidth = parseInt(newWidth);
    //     this.styles.lineWidth = newWidth;
    // }

    isValid(width: number): boolean {
        return true;
    }
}
