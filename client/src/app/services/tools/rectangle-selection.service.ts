import { Injectable } from '@angular/core';
import { Selection } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineHelperService } from '@app/services/tools/line-helper.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SquareHelperService } from '@app/services/tools/square-helper.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';

const INDEX = 7;
const ANCHOR_OFFSET = 3;
const ANCHOR_RADIUS = 5;

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends Selection {
    startingPoint: Vec2;
    endPoint: Vec2;
    shiftIsPressed: boolean;
    hasBeenReseted: boolean = false;
    currentLine: Vec2[] = [];
    eventListenerIsSet: boolean;
    contour: boolean = true;
    imageData: ImageData;
    backgroundImageData: ImageData;
    allowShift: boolean = true;
    isMovingImg: boolean = false;
    currentlySelecting: boolean = false;

    constructor(
        public drawingService: DrawingService,
        public squareHelperService: SquareHelperService,
        public rectangleService: RectangleService,
        public lineHelper: LineHelperService,
        undoRedoManager: UndoRedoManagerService,
    ) {
        super(drawingService, undoRedoManager);
        this.shortcut = 'r';
        this.currentLine = [];
        this.index = INDEX;
        this.toolStyles = {
            primaryColor: 'black',
            lineWidth: 1,
            fill: true,
            secondaryColor: 'black',
        };
        this.hasBeenReseted = false;
    }

    selectAll(): void {
        this.currentLine = [
            { x: 0, y: 0 },
            { x: this.drawingService.baseCtx.canvas.offsetWidth, y: this.drawingService.baseCtx.canvas.offsetHeight - ANCHOR_OFFSET },
        ];
        this.drawLine(this.drawingService.previewCtx, this.currentLine);
        this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
    }

    onMouseDown(mouseDownEvent: MouseEvent): void {
        this.mouseDown = mouseDownEvent.button === MouseButton.Left;
        if (this.mouseDown) {
            this.undoRedoManager.disableUndoRedo();
            if (this.currentLine.length > 0) {
                if (!this.checkIfInsideRectangle(mouseDownEvent)) {
                    this.resetState();
                    this.isMovingImg = false;
                    return;
                }
                if (!this.currentlySelecting) {
                    this.imageData = this.getImageData();
                }
                this.isMovingImg = true;
                this.lastPos = this.getPositionFromMouse(mouseDownEvent);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                return;
            }
            this.isMovingImg = false;
            this.anchorPoints = [];
            this.mouseDownCoord = this.getPositionFromMouse(mouseDownEvent);
            this.startingPoint = this.mouseDownCoord;
        }
    }

    checkIfInsideRectangle(event: MouseEvent): boolean {
        const CLICK_COORDS: Vec2 = { x: event.offsetX, y: event.offsetY };
        const X = CLICK_COORDS.x;
        const Y = CLICK_COORDS.y;
        const MIN_X = this.currentLine[0].x;
        const MIN_Y = this.currentLine[0].y;
        const MAX_X = this.currentLine[1].x;
        const MAX_Y = this.currentLine[1].y;
        return X >= MIN_X && X <= MAX_X && Y >= MIN_Y && Y <= MAX_Y;
    }

    setShiftIsPressed = (keyDownShiftEvent: KeyboardEvent) => {
        if (keyDownShiftEvent.key === 'Shift' && this.allowShift) {
            this.shiftIsPressed = true;
            if (
                !this.squareHelperService.checkIfIsSquare([this.startingPoint, this.endPoint]) &&
                !this.drawingService.resizeActive &&
                this.mouseDown
            ) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.currentLine = [this.startingPoint, this.squareHelperService.closestSquare([this.startingPoint, this.endPoint])];
                this.drawLine(this.drawingService.previewCtx, this.currentLine);
            }
        }
    };

    setShiftNonPressed = (keyUpShiftEvent: KeyboardEvent) => {
        if (keyUpShiftEvent.key === 'Shift') {
            this.shiftIsPressed = false;
            if (this.mouseDown && !this.drawingService.resizeActive) {
                this.shiftIsPressed = false;
                window.removeEventListener('keypress', this.setShiftIsPressed);
                window.removeEventListener('keyup', this.setShiftNonPressed);
                this.currentLine = [this.startingPoint, this.endPoint];
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.currentLine);
                this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
            } else {
                this.allowShift = true;
            }
        }
    };

    getImageData(): ImageData {
        const width: number = this.currentLine[1].x - this.currentLine[0].x;
        const height: number = this.currentLine[1].y - this.currentLine[0].y;
        const imgData = this.drawingService.baseCtx.getImageData(this.currentLine[0].x, this.currentLine[0].y, width, height);
        this.drawingService.baseCtx.clearRect(this.currentLine[0].x, this.currentLine[0].y, width, height);
        this.backgroundImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        this.drawingService.baseCtx.putImageData(imgData, this.currentLine[0].x, this.currentLine[0].y);
        this.currentlySelecting = true;
        return imgData;
    }

    moveImageData(offsetX: number, offsetY: number): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.currentLine[0].x += offsetX - this.lastPos.x;
        this.currentLine[1].x += offsetX - this.lastPos.x;
        this.currentLine[0].y += offsetY - this.lastPos.y;
        this.currentLine[1].y += offsetY - this.lastPos.y;
        this.drawingService.baseCtx.putImageData(this.backgroundImageData, 0, 0);
        this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
        this.drawLine(this.drawingService.previewCtx, this.currentLine);
        this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
        this.lastPos.x = offsetX;
        this.lastPos.y = offsetY;
    }

    onMouseUp(mouseUpEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive) {
            this.undoRedoManager.enableUndoRedo();
            if (this.hasBeenReseted) {
                this.hasBeenReseted = false;
                this.mouseDown = false;
                return;
            }
            if (!this.currentlySelecting) {
                this.imageData = this.getImageData();
            }
            if (this.isMovingImg) {
                this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
                this.mouseDown = false;
                return;
            }

            if (!this.shiftIsPressed) {
                const mousePosition = this.getPositionFromMouse(mouseUpEvent);
                this.endPoint = mousePosition;
                this.currentLine = [this.startingPoint, this.endPoint];
            }
            this.lastPos.x = mouseUpEvent.offsetX;
            this.lastPos.y = mouseUpEvent.offsetY;
            this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
            this.mouseDown = false;
        }
    }

    onMouseMove(mouseMoveEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive && !this.hasBeenReseted) {
            this.undoRedoManager.disableUndoRedo();
            this.hasBeenReseted = false;
            if (this.isMovingImg) {
                this.moveImageData(mouseMoveEvent.offsetX, mouseMoveEvent.offsetY);
                return;
            }
            const mousePosition = this.getPositionFromMouse(mouseMoveEvent);
            this.endPoint = mousePosition;
            if (this.shiftIsPressed) {
                this.currentLine = [this.startingPoint, this.squareHelperService.closestSquare([this.startingPoint, this.endPoint])];
                if (this.squareHelperService.checkIfIsSquare([this.startingPoint, this.endPoint])) {
                    this.currentLine = [this.startingPoint, this.endPoint];
                }
            } else {
                this.currentLine = [this.startingPoint, this.endPoint];
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.currentLine);
        }
    }

    drawAnchorPoints(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.anchorPoints = [];

        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';

        ctx.beginPath();
        ctx.arc(path[0].x, path[0].y, ANCHOR_RADIUS, 0, Math.PI * 2); // initial
        this.anchorPoints.push({ x: path[0].x, y: path[0].y });
        ctx.fill();

        ctx.beginPath();
        ctx.arc((path[0].x + path[1].x) / 2, path[0].y, ANCHOR_RADIUS, 0, Math.PI * 2); // milieu horizontal
        this.anchorPoints.push({ x: (path[0].x + path[1].x) / 2, y: path[0].y });
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[1].x, path[0].y, ANCHOR_RADIUS, 0, Math.PI * 2); // inverse horizontal
        this.anchorPoints.push({ x: path[1].x, y: path[0].y });
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[1].x, (path[0].y + path[1].y) / 2, ANCHOR_RADIUS, 0, Math.PI * 2); // milieu vertical inverse
        this.anchorPoints.push({ x: path[1].x, y: (path[0].y + path[1].y) / 2 });
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[1].x, path[1].y, ANCHOR_RADIUS, 0, Math.PI * 2); // fin
        this.anchorPoints.push({ x: path[1].x, y: path[1].y });
        ctx.fill();

        ctx.beginPath();
        ctx.arc((path[0].x + path[1].x) / 2, path[1].y, ANCHOR_RADIUS, 0, Math.PI * 2); // milieu horizontal inverse
        this.anchorPoints.push({ x: (path[0].x + path[1].x) / 2, y: path[1].y });
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[0].x, path[1].y, ANCHOR_RADIUS, 0, Math.PI * 2); // inverse vertical
        this.anchorPoints.push({ x: path[0].x, y: path[1].y });
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[0].x, (path[0].y + path[1].y) / 2, ANCHOR_RADIUS, 0, Math.PI * 2); // milieu vertical
        this.anchorPoints.push({ x: path[0].x, y: (path[0].y + path[1].y) / 2 });
        ctx.fill();
    }

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.fillStyle = 'white';
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.toolStyles.lineWidth;
        ctx.lineCap = 'square';
        ctx.strokeStyle = 'black';
        ctx.strokeRect(path[0].x, path[0].y, path[1].x - path[0].x, path[1].y - path[0].y);
        ctx.closePath();
    }
}
