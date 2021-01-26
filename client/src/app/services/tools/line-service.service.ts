import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { faSlash } from '@fortawesome/free-solid-svg-icons';

@Injectable({
    providedIn: 'root',
})
export class LineServiceService extends Tool {
    eventTest: boolean = false;
    shiftIsPressed: boolean;
    test: Function;
    lastSegment: Vec2[];
    public paths: Vec2[][] = [];
    private isStarted: boolean;
    private startingPoint: Vec2;
    private endPoint: Vec2;
    public lineWidth: number;
    public ID: number = 1;
    public icon = faSlash;
    localShortcut: Map<string, Function> = new Map([
        ['Shift', this.onShift],
        ['Backspace', this.onBackspace],
        ['Escape', this.onEscape],
    ]);

    //shortcut: string = 'l';

    //public toolManager: ToolManagerService;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.isStarted = false;
        //this.toolManager = toolManager;
        //this.clearPath();
        this.shortcut = 'l';
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
        this.paths.pop();
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        for (let path of this.paths) {
            this.drawLine(this.drawingService.baseCtx, path[0], path[1]);
        }
    }

    setShiftIfPressed = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            this.shiftIsPressed = true;
            //console.log('true');
        }
    };

    setShiftNonPressed = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            this.shiftIsPressed = false;
            //console.log('false');
            window.removeEventListener('keypress', this.setShiftIfPressed);
            window.removeEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = false;
        }
    };

    onShift(): void {
        if (!this.eventTest) {
            window.addEventListener('keydown', this.setShiftIfPressed);
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.eventTest = true;
        }
    }

    shiftAngleCalculator(start: Vec2, end: Vec2): boolean {
        let a: number = Math.abs(start.x - end.x);
        let b: number = Math.abs(start.y - end.y);
        let angle: number = Math.atan2(b, a) * (180 / Math.PI);

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
            this.drawLine(this.drawingService.baseCtx, this.startingPoint, this.endPoint);
        }
        this.mouseDown = false;
        //this.clearPath();
    }

    onMouseClick(event: MouseEvent): void {
        if (!this.isStarted) {
            this.isStarted = true;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.startingPoint = this.mouseDownCoord;
        } else {
            const mousePosition = this.getPositionFromMouse(event);
            this.endPoint = mousePosition;
            this.drawLine(this.drawingService.baseCtx, this.startingPoint, this.endPoint);
            this.lastSegment = [this.startingPoint, this.endPoint];
            this.paths.push(this.lastSegment);
            this.startingPoint = this.endPoint;
        }
    }

    onDoubleClick(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.distanceUtil(this.startingPoint, mousePosition)) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.isStarted = false;
        } else {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, this.startingPoint, this.endPoint);
            this.isStarted = false;
        }
    }

    distanceUtil(start: Vec2, end: Vec2): boolean {
        var a = start.x - end.x;
        var b = start.y - end.y;

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
                    this.drawLine(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
                }
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.startingPoint, this.endPoint);
            }
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2): void {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.lineWidth;
        //ctx.lineCap = 'round';

        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    getShorcutValue(): string {
        return this.shortcut;
    }

    getLocalShorcuts(): Map<string, Function> {
        return this.localShortcut;
    }

    // private clearPath(): void {
    //     this.pathData = [];
    // }
}
