import { Injectable } from '@angular/core';
import { Selection } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ClipboardService } from '@app/services/tools/clipboard.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { SquareHelperService } from '@app/services/tools/square-helper.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';

export interface ABHKAxis {
    A: number;
    B: number;
    H: number;
    K: number;
    xAxis: boolean;
}

const INDEX = 8;
const INDEXES_PER_PIXEL = 4;
const ELLIPSE_LINE_DASH = 3;

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends Selection {
    constructor(
        public drawingService: DrawingService,
        public squareHelperService: SquareHelperService,
        undoRedoManager: UndoRedoManagerService,
        public clipboardService: ClipboardService,
        public magnetismService: MagnetismService,
    ) {
        super(drawingService, undoRedoManager, magnetismService, clipboardService);
        this.shortcut = 's';
        this.index = INDEX;
    }

    onMouseDown(mouseDownEvent: MouseEvent): void {
        this.mouseDown = mouseDownEvent.button === MouseButton.Left;
        if (this.mouseDown) {
            this.undoRedoManager.disableUndoRedo();
            if (this.currentLine.length > 0) {
                const ELLIPSE_PARAMETERS: ABHKAxis = this.getABHKXaxis();
                if (!this.checkIfInsideEllipse(ELLIPSE_PARAMETERS, mouseDownEvent.offsetX, mouseDownEvent.offsetY)) {
                    this.resetState();
                    this.isMovingImg = false;
                    return;
                }
                if (!this.currentlySelecting) {
                    this.imageData = this.getImageData();
                }
                this.fixImageData();
                this.isMovingImg = true;
                this.lastPos = this.getPositionFromMouse(mouseDownEvent);
                this.magnetismService.mouseReference = this.getPositionFromMouse(mouseDownEvent);
                return;
            } else {
                this.isMovingImg = false;
            }
            this.anchorPoints = [];
            this.mouseDownCoord = this.getPositionFromMouse(mouseDownEvent);
            this.startingPoint = this.mouseDownCoord;
        }
    }

    setShiftIsPressed = (keyDownShiftEvent: KeyboardEvent) => {
        if (keyDownShiftEvent.key === 'Shift') {
            this.shiftIsPressed = true;
            if (!this.squareHelperService.checkIfIsSquare([this.startingPoint, this.endPoint]) && this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.startingPoint, this.endPoint, false);
                this.drawRectangle(this.drawingService.previewCtx, [
                    this.startingPoint,
                    this.squareHelperService.closestSquare([this.startingPoint, this.endPoint]),
                ]);
            }
        }
    };

    setShiftNonPressed = (keyUpShiftEvent: KeyboardEvent): void => {
        if (keyUpShiftEvent.key === 'Shift') {
            this.shiftIsPressed = false;
            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawEllipse(this.drawingService.previewCtx, this.startingPoint, this.endPoint, false);
                this.drawRectangle(this.drawingService.previewCtx, [this.startingPoint, this.endPoint]);
            }
            window.removeEventListener('keydown', this.setShiftIsPressed);
            window.removeEventListener('keyup', this.setShiftNonPressed);
            this.shiftIsPressed = false;
        }
    };

    getImageData(): ImageData {
        const width: number = this.currentLine[1].x - this.currentLine[0].x;
        const height: number = this.currentLine[1].y - this.currentLine[0].y;
        const imgData = this.drawingService.baseCtx.getImageData(this.currentLine[0].x, this.currentLine[0].y, width, height);
        this.drawEllipse(this.drawingService.baseCtx, this.startingPoint, this.endPoint, true);
        this.backgroundImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        this.currentlySelecting = true;
        return imgData;
    }

    cleanImgData(): void {
        const ELLIPSE_PARAMETERS: ABHKAxis = this.getABHKXaxis();

        for (let i = 0; i < this.imageData.data.length; i += INDEXES_PER_PIXEL) {
            const x = ((i / INDEXES_PER_PIXEL) % this.imageData.width) + this.currentLine[0].x;
            const y = (Math.floor(i / INDEXES_PER_PIXEL) - x) / this.imageData.width + this.currentLine[0].y;
            if (!this.checkIfInsideEllipse(ELLIPSE_PARAMETERS, x, y)) {
                for (let j = i; j < i + INDEXES_PER_PIXEL; j++) {
                    this.imageData.data[j] = 0;
                }
            }
        }
    }

    checkIfInsideEllipse(parameters: ABHKAxis, x: number, y: number): boolean {
        if (!parameters.xAxis) {
            const tmp: number = parameters.A;
            parameters.A = parameters.B;
            parameters.B = tmp;
        }
        const firstMember: number = Math.pow(x - parameters.H, 2) / (parameters.A * parameters.A);
        const secondMember: number = Math.pow(y - parameters.K, 2) / (parameters.B * parameters.B);
        return firstMember + secondMember <= 1;
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
        this.fixImageData();
        this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
        this.drawRectangle(this.drawingService.previewCtx, this.currentLine);
        this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
        this.drawEllipse(this.drawingService.previewCtx, this.currentLine[0], this.currentLine[1], false);
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
            this.mouseDown = false;
            if (this.hasBeenReseted) {
                this.hasBeenReseted = false;
                return;
            }

            if (!this.currentlySelecting) {
                this.imageData = this.getImageData();
                this.cleanImgData();
                this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
            }

            if (this.isMovingImg) {
                this.fixImageData();
                this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
                return;
            }

            if (!this.shiftIsPressed) {
                const mousePosition = this.getPositionFromMouse(mouseUpEvent);
                this.endPoint = mousePosition;
                this.currentLine = [this.startingPoint, this.endPoint];
            }
            this.lastPos.x = mouseUpEvent.offsetX;
            this.lastPos.y = mouseUpEvent.offsetY;
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.fixCurrentLine();
            this.drawRectangle(this.drawingService.previewCtx, this.currentLine);
            this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
            this.drawEllipse(this.drawingService.previewCtx, this.startingPoint, this.endPoint, false);
        }
    }

    getABHKXaxis(): ABHKAxis {
        const h: number = this.currentLine[0].x + Math.abs((this.currentLine[1].x - this.currentLine[0].x) / 2);
        const k: number = this.currentLine[0].y + Math.abs((this.currentLine[1].y - this.currentLine[0].y) / 2);
        let a: number;
        let b: number;
        let xAxis = true;

        if (Math.abs(this.currentLine[0].x - this.currentLine[1].x) > Math.abs(this.currentLine[0].y - this.currentLine[1].y)) {
            a = Math.abs(this.currentLine[0].x - this.currentLine[1].x) / 2;
            b = Math.abs(this.currentLine[0].y - this.currentLine[1].y) / 2;
        } else {
            b = Math.abs(this.currentLine[0].x - this.currentLine[1].x) / 2;
            a = Math.abs(this.currentLine[0].y - this.currentLine[1].y) / 2;
            xAxis = false;
        }

        const returnValue: ABHKAxis = { A: a, B: b, H: h, K: k, xAxis };
        return returnValue;
    }

    fixImageData(): void {
        const width: number = this.currentLine[1].x - this.currentLine[0].x;
        const height: number = this.currentLine[1].y - this.currentLine[0].y;
        const tmpImgData = this.drawingService.baseCtx.getImageData(this.currentLine[0].x, this.currentLine[0].y, width, height);
        const ELLIPSE_PARAMETERS: ABHKAxis = this.getABHKXaxis();
        for (let i = 0; i < tmpImgData.data.length; i += INDEXES_PER_PIXEL) {
            const x: number = ((i / INDEXES_PER_PIXEL) % this.imageData.width) + this.currentLine[0].x;
            const y: number = (Math.floor(i / INDEXES_PER_PIXEL) - x) / this.imageData.width + this.currentLine[0].y;
            if (!this.checkIfInsideEllipse(ELLIPSE_PARAMETERS, x, y)) {
                for (let j = i; j < i + INDEXES_PER_PIXEL; j++) {
                    this.imageData.data[j] = tmpImgData.data[j];
                }
            }
        }
    }

    onMouseMove(mouseMoveEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive && !this.hasBeenReseted) {
            this.undoRedoManager.disableUndoRedo();
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
                this.endPoint = this.squareHelperService.closestSquare([this.startingPoint, this.endPoint]);
            }
            this.currentLine = [this.startingPoint, this.endPoint];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.startingPoint, this.endPoint, false);
            this.drawRectangle(this.drawingService.previewCtx, this.currentLine);
        }
    }

    drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = 1;
        ctx.lineCap = 'square';
        ctx.strokeRect(path[0].x, path[0].y, path[1].x - path[0].x, path[1].y - path[0].y);
        ctx.closePath();
    }

    drawEllipse(ctx: CanvasRenderingContext2D, start: Vec2, end: Vec2, erase: boolean): void {
        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
        }
        ctx.strokeStyle = 'black';
        if (!erase) {
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.globalCompositeOperation = 'destination-out';
        }
        const width = end.y - start.y;
        const height = end.x - start.x;
        const radiusX = width / 2;
        const radiusY = height / 2;

        ctx.beginPath();
        ctx.setLineDash([ELLIPSE_LINE_DASH]);

        if (this.shiftIsPressed) {
            const squareCornerPos = this.squareHelperService.closestSquare([this.startingPoint, this.endPoint]);
            ctx.arc(
                (this.startingPoint.x + squareCornerPos.x) / 2,
                (this.startingPoint.y + squareCornerPos.y) / 2,
                Math.abs((this.startingPoint.x - squareCornerPos.x) / 2),
                0,
                2 * Math.PI,
            );
        } else {
            ctx.ellipse(start.x + radiusY, start.y + radiusX, Math.abs(radiusX), Math.abs(radiusY), Math.PI / 2, 0, 2 * Math.PI);
        }
        if (erase) {
            ctx.fillStyle = 'white';
            ctx.fill();
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    deleteSelection(): void {
        this.drawEllipse(this.drawingService.baseCtx, this.startingPoint, this.endPoint, true);
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
            this.drawEllipse(this.drawingService.baseCtx, this.startingPoint, this.endPoint, false);

            this.currentLine = [
                { x: 0, y: 0 },
                { x: this.clipboardService.copy.width, y: this.clipboardService.copy.height },
            ];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.baseCtx, this.currentLine);
            this.drawEllipse(this.drawingService.baseCtx, this.startingPoint, this.endPoint, false);
            this.drawAnchorPoints(this.drawingService.previewCtx, this.currentLine);
            this.drawingService.baseCtx.putImageData(this.clipboardService.copy, this.currentLine[0].x, this.currentLine[0].y);
            this.imageData = this.clipboardService.copy;
        }
    }
}
