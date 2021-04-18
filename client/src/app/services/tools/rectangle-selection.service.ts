import { Injectable } from '@angular/core';
import { Selection } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ClipboardService } from '@app/services/tools/clipboard.service';
import { LineHelperService } from '@app/services/tools/line-helper.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SquareHelperService } from '@app/services/tools/square-helper.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';

const INDEX = 7;
const ANCHOR_OFFSET = 3;

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends Selection {
    eventListenerIsSet: boolean;
    contour: boolean = true;
    allowShift: boolean = true;

    constructor(
        public drawingService: DrawingService,
        public squareHelperService: SquareHelperService,
        public rectangleService: RectangleService,
        public lineHelper: LineHelperService,
        undoRedoManager: UndoRedoManagerService,
        public magnetismService: MagnetismService,
        public clipboardService: ClipboardService,
    ) {
        super(drawingService, undoRedoManager, magnetismService, clipboardService);

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
                    console.log('test');
                    this.imageData = this.getImageData();
                }

                this.isMovingImg = true;
                this.lastPos = this.getPositionFromMouse(mouseDownEvent);
                this.magnetismService.mouseReference = this.getPositionFromMouse(mouseDownEvent);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                return;
            }
            this.isMovingImg = false;
            this.anchorPoints = [];
            this.mouseDownCoord = this.getPositionFromMouse(mouseDownEvent);
            this.startingPoint = this.mouseDownCoord;
            this.lastPos.x = mouseDownEvent.offsetX;
            this.lastPos.y = mouseDownEvent.offsetY;
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
        if (!this.magnetismService.isActivated) {
            this.currentLine[0].x += offsetX - this.lastPos.x;
            this.currentLine[1].x += offsetX - this.lastPos.x;
            this.currentLine[0].y += offsetY - this.lastPos.y;
            this.currentLine[1].y += offsetY - this.lastPos.y;
        } else {
            this.currentLine[0].x += offsetX;
            this.currentLine[1].x += offsetX;
            this.currentLine[0].y += offsetY;
            this.currentLine[1].y += offsetY;
        }
        this.drawingService.baseCtx.putImageData(this.backgroundImageData, 0, 0);
        this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
        this.drawLine(this.drawingService.previewCtx, this.currentLine);
        this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
        if (!this.magnetismService.isActivated) {
            this.lastPos.x = offsetX;
            this.lastPos.y = offsetY;
        } else {
            this.magnetismService.mouseReference.x += offsetX;
            this.magnetismService.mouseReference.y += offsetY;
        }
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
                console.log(this.currentLine);
            }

            this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
            this.mouseDown = false;
        }
    }

    onMouseMove(mouseMoveEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive && !this.hasBeenReseted) {
            this.undoRedoManager.disableUndoRedo();
            this.hasBeenReseted = false;
            if (this.isMovingImg) {
                if (this.magnetismService.isActivated) {
                    const shifting: Vec2 = this.magnetismService.dispatch(mouseMoveEvent, this.currentLine);
                    this.moveImageData(shifting.x, shifting.y);
                    return;
                }
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

    drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.fillStyle = 'white';
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.toolStyles.lineWidth;
        ctx.lineCap = 'square';
        ctx.strokeStyle = 'black';
        ctx.strokeRect(path[0].x, path[0].y, path[1].x - path[0].x, path[1].y - path[0].y);
        ctx.closePath();
    }

    deleteSelection(): void {
        this.clipboardService.deleteImageDataRectangle(this.drawingService.baseCtx, this.currentLine);
        this.imageData = this.getImageData();
    }

    pasteSelection(): void {
        if (this.clipboardService.alreadyCopied) {
            this.backgroundImageData = this.drawingService.baseCtx.getImageData(
                0,
                0,
                this.drawingService.baseCtx.canvas.width,
                this.drawingService.baseCtx.canvas.height,
            );
            this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
            this.currentLine = [
                { x: 0, y: 0 },
                { x: this.clipboardService.copy.width, y: this.clipboardService.copy.height },
            ];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.currentLine);
            this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
            this.drawingService.baseCtx.putImageData(this.clipboardService.copy, this.currentLine[0].x, this.currentLine[0].y);
            this.imageData = this.clipboardService.copy;
        }
    }
}
