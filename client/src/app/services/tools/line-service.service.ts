import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { faSlash } from '@fortawesome/free-solid-svg-icons';
import { PencilService } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class LineServiceService extends Tool {
    eventTest: boolean = false;
    shiftIsPressed: boolean;
    test: Function;
    line: Vec2[];
    currentPos: Vec2;
    lastSegment: Vec2[];
    lineIndexes: number[] = [];
    public paths: Vec2[][] = [];
    private isStarted: boolean;
    private startingPoint: Vec2;
    private endPoint: Vec2;
    private lineWidth: number;
    public icon = faSlash;
    private pencilService: PencilService;
    localShortcut = new Map([
        ['Shift', this.onShift],
        ['Backspace', this.onBackspace],
        ['Escape', this.onEscape],
    ]);

    constructor(drawingService: DrawingService, pencilService: PencilService) {
        super(drawingService);
        this.isStarted = false;
        this.shortcut = 'l';
        this.pencilService = pencilService;
    }

    // setCurrent(): void {
    //     this.toolManager.setLineService();
    // }

    // onMouseDown(event: MouseEvent): void {
    //     this.mouseDown = event.button === MouseButton.Left;
    //     if (this.mouseDown) {

    //         this.mouseDownCoord = this.getPositionFromMouse(event);
    //         this.startingPoint = this.mouseDownCoord;
    //     }
    // }

    localShortCutHandler(key: string) {
        this.test = <Function>this.localShortcut.get(key);
        this.test();
    }

    onEscape(): void {
        this.isStarted = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onBackspace(): void {
        if (this.drawingService.drawings.size > 0) {
            // let last = Array.from(this.drawingService.drawings)[this.drawingService.drawings.size - 1][0];
            // this.drawingService.drawings.delete(last);
            let index: number = Array.from(this.drawingService.drawings).length - 1;
            let last = Array.from(this.drawingService.drawings)[index][1];
            console.log('test1');
            while (last !== this) {
                if (index > 0) {
                    console.log('test2');
                    last = Array.from(this.drawingService.drawings)[--index][1];
                } else {
                    console.log('test3');
                    return;
                }
            }
            let lastLine = Array.from(this.drawingService.drawings)[index][0];
            this.drawingService.drawings.delete(lastLine);
            this.drawingService.clearCanvas(this.drawingService.baseCtx);
            for (let entry of this.drawingService.drawings.entries()) {
                entry[1].redrawLine(this.drawingService.baseCtx, entry[0]);
                //console.log('entry');
            }
            this.drawingService.pencilDrawings.forEach((item) => {
                this.pencilService.redrawLine(this.drawingService.baseCtx, item);
                //console.log('pencil');
            });
        }
    }

    setShiftIfPressed = () => {
        // if (e.key === 'Shift') {
        this.shiftIsPressed = true;
        if (!this.shiftAngleCalculator(this.startingPoint, this.endPoint)) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            let line: Vec2[] = [this.startingPoint, this.closestAngledPoint(this.startingPoint, this.endPoint)];
            this.drawLine(this.drawingService.previewCtx, line);
        }
        window.removeEventListener('keydown', this.setShiftIfPressed);
        //}
    };

    setShiftNonPressed = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            this.shiftIsPressed = false;
            //console.log('false');
            //window.removeEventListener('keydown', this.setShiftIfPressed);
            window.removeEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = false;
            this.line = [this.startingPoint, this.endPoint];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.line);
        }
    };

    onShift(): void {
        if (!this.eventTest) {
            //window.addEventListener('keydown', this.setShiftIfPressed);
            this.setShiftIfPressed();
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = true;
        }
    }

    closestValidAngle(start: Vec2, end: Vec2): number {
        let possibleAngles: number[] = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        let closestValid: number = 999;

        let a: number = Math.abs(start.x - end.x);
        let b: number = Math.abs(start.y - end.y);
        let angle: number = Math.atan2(b, a) * (180 / Math.PI);
        angle = this.angleQuadrantConverter(start, end, angle);

        for (let angles of possibleAngles) {
            if (Math.abs(angle - angles) < Math.abs(angle - closestValid)) {
                closestValid = angles;
            }
        }

        return closestValid;
    }

    closestAngledPoint(start: Vec2, end: Vec2): Vec2 {
        let closestAngle: number = this.closestValidAngle(start, end);
        let currentVectorMagnitude: number = this.distanceUtil(start, end);
        let toRadian = Math.PI / 180;
        let x_: number = start.x + currentVectorMagnitude * Math.cos(closestAngle * toRadian);
        let y_: number = start.y - currentVectorMagnitude * Math.sin(closestAngle * toRadian);

        let newLine: Vec2 = { x: x_, y: y_ };

        return newLine;
    }

    distanceUtil(start: Vec2, end: Vec2): number {
        var a = Math.abs(start.x - end.x);
        var b = Math.abs(start.y - end.y);

        return Math.sqrt(a * a + b * b);
    }

    angleQuadrantConverter(start: Vec2, end: Vec2, angle: number): number {
        if (start.x <= end.x && start.y >= end.y) {
            angle = angle;
            return angle;
        } else if (start.x <= end.x && start.y <= end.y) {
            angle = 360 - angle;
            return angle;
        } else if (start.x >= end.x && start.y >= end.y) {
            angle = 180 - angle;
            return angle;
        } else {
            angle = angle + 180;
            return angle;
        }
    }

    shiftAngleCalculator(start: Vec2, end: Vec2): boolean {
        let a: number = Math.abs(start.x - end.x);
        let b: number = Math.abs(start.y - end.y);
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
            let line: Vec2[] = [this.startingPoint, this.endPoint];
            this.drawLine(this.drawingService.baseCtx, line);
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
            let line: Vec2[] = [this.startingPoint, this.endPoint];
            this.drawLine(this.drawingService.baseCtx, line);
            this.lastSegment = [this.startingPoint, this.endPoint];
            this.drawingService.drawings.set(this.lastSegment, this);
            this.startingPoint = this.endPoint;
        }
    }

    onDoubleClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.pixelDistanceUtil(this.startingPoint, mousePosition)) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, [this.startingPoint, this.startingPoint]);
            this.isStarted = false;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            let line: Vec2[] = [this.startingPoint, this.endPoint];
            this.drawLine(this.drawingService.baseCtx, line);
            this.lastSegment = [this.startingPoint, this.endPoint];
            this.drawingService.drawings.set(this.lastSegment, this);
            this.isStarted = false;
        }
    }

    pixelDistanceUtil(start: Vec2, end: Vec2): boolean {
        var a = Math.abs(start.x - end.x);
        var b = Math.abs(start.y - end.y);

        return a <= 20 && b <= 20;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isStarted) {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            if (this.shiftIsPressed) {
                if (this.shiftAngleCalculator(this.startingPoint, this.endPoint)) {
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    let line: Vec2[] = [this.startingPoint, this.endPoint];
                    this.drawLine(this.drawingService.previewCtx, line);
                }
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                let line: Vec2[] = [this.startingPoint, this.endPoint];
                this.drawLine(this.drawingService.previewCtx, line);
            }
        }
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        if (ctx == this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
        }
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }

    redrawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;

        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
    }

    getShorcutValue(): string {
        return this.shortcut;
    }

    getLocalShorcuts(): Map<string, Function> {
        return this.localShortcut;
    }
}
