import { Injectable } from '@angular/core';
import { Selection } from '@app/classes/selection';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';
import { LassoHelperService } from './lasso-helper.service';
import { LineHelperService } from './line-helper.service';
const ANCHOR_RADIUS = 10;
const MINUS_ONE = -1;
const SEGMENT_TWO = 5;
const SEGMENT_ONE = 3;
const INDEX = 10;
@Injectable({
    providedIn: 'root',
})
export class LassoService extends Selection {
    lineHelper: LineHelperService;
    lassoHelper: LassoHelperService;
    shiftIsPressed: boolean = false;
    calledFromMouseClick: boolean = false;
    angledEndPoint: Vec2;
    blockOnShift: boolean;
    backgroundImageData: ImageData;
    isPolygonClosed: boolean = false;
    imageData: ImageData;
    height: number;
    width: number;
    changeAnchor: boolean = false;

    constructor(
        public drawingService: DrawingService,
        lineHelper: LineHelperService,
        lassoHelper: LassoHelperService,
        undoRedoManager: UndoRedoManagerService,
    ) {
        super(drawingService, undoRedoManager);
        this.isStarted = false;
        this.lineHelper = lineHelper;
        this.lassoHelper = lassoHelper;
        this.index = INDEX;
        this.shortcut = 'v';
        this.toolStyles = { primaryColor: 'black', lineWidth: 1 };
        this.currentLine = [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
        ];
    }

    onMouseClick(mouseClickEvent: MouseEvent): void {
        if (!this.isPolygonClosed && !this.hasBeenReseted) {
            if (!this.isStarted) {
                this.isStarted = true;
                this.startingPoint = this.getPositionFromMouse(mouseClickEvent);
            } else {
                if (this.lassoPath.length >= 2 && this.lineHelper.pixelDistanceUtil(this.lassoPath[0][0], this.endPoint)) {
                    this.endPoint = this.lassoPath[0][0];
                    this.lassoPath.push([this.startingPoint, this.endPoint]);
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                    this.lassoHelper.updateRectangle(this.lassoPath, this.currentLine, this.width, this.height);
                    this.isPolygonClosed = true;
                    for (const line of this.lassoPath) {
                        this.drawPath(this.drawingService.previewCtx, line, 'black');
                    }

                    this.isStarted = false;
                    this.imageData = this.getImageData();
                    return;
                }

                this.endPoint = this.getPositionFromMouse(mouseClickEvent);

                if (!this.drawingService.resizeActive) {
                    this.drawingService.drawingStarted = false;
                    if (!this.lassoHelper.detectIntersection([this.startingPoint, this.endPoint], this.lassoPath)) {
                        this.drawPath(this.drawingService.previewCtx, [this.startingPoint, this.endPoint], 'black');
                        this.lassoPath.push([this.startingPoint, this.endPoint]);
                        this.startingPoint = this.endPoint;
                    } else {
                        this.drawPath(this.drawingService.previewCtx, [this.startingPoint, this.endPoint], 'red');
                    }
                }
                if (this.shiftIsPressed) {
                    this.calledFromMouseClick = true;
                    this.setShiftNonPressed();
                    this.calledFromMouseClick = false;
                }
            }
        } else {
            this.hasBeenReseted = false;
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.isPolygonClosed && this.mouseDown) {
            if (this.checkIfClickOnAnchor(event)) {
                this.changeAnchor = true;
                return;
            }
            this.changeAnchor = false;
            if (!this.lassoHelper.isInsidePolygon(this.getPositionFromMouse(event), this.lassoPath)) {
                this.isPolygonClosed = false;
                this.resetState();
                this.currentLine = [
                    { x: 0, y: 0 },
                    { x: 0, y: 0 },
                ];
                return;
            }

            if (!this.currentlySelecting) {
                this.imageData = this.getImageData();
            }

            this.lassoHelper.fixImageData(this.drawingService.baseCtx, this.currentLine, this.imageData, this.lassoPath);
            this.isMovingImg = true;
            this.lastPos = this.getPositionFromMouse(event);
        } else {
            this.isMovingImg = false;
        }
    }

    getImageData(): ImageData {
        this.lassoHelper.updateRectangle(this.lassoPath, this.currentLine, this.width, this.height);
        this.height = this.currentLine[1].y - this.currentLine[0].y;
        this.width = this.currentLine[1].x - this.currentLine[0].x;
        const imgData = this.drawingService.baseCtx.getImageData(this.currentLine[0].x, this.currentLine[0].y, this.width, this.height);
        this.lassoHelper.clipRegion(this.drawingService.baseCtx, this.lassoPath);
        this.backgroundImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        this.currentlySelecting = true;
        return imgData;
    }

    moveImageData(offsetX: number, offsetY: number): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.currentLine[0].x += offsetX - this.lastPos.x;
        this.currentLine[1].x += offsetX - this.lastPos.x;
        this.currentLine[1].y += offsetY - this.lastPos.y;
        this.currentLine[0].y += offsetY - this.lastPos.y;
        for (const line of this.lassoPath) {
            line[1].x += offsetX - this.lastPos.x;
            line[1].y += offsetY - this.lastPos.y;
        }
        this.drawingService.baseCtx.putImageData(this.backgroundImageData, 0, 0);
        this.lassoHelper.fixImageData(this.drawingService.baseCtx, this.currentLine, this.imageData, this.lassoPath);
        this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
        for (const line of this.lassoPath) {
            this.drawPath(this.drawingService.previewCtx, line, 'black');
        }
        this.lastPos.x = offsetX;
        this.lastPos.y = offsetY;
    }

    onMouseUp(mouseUpEvent: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseDown = false;
            if (this.hasBeenReseted) {
                return;
            }
            if (!this.isPolygonClosed) {
                this.endPoint = this.getPositionFromMouse(mouseUpEvent);
                this.drawingService.drawingStarted = true;
                this.drawPath(this.drawingService.previewCtx, [this.startingPoint, this.endPoint], 'black');
            } else {
                if (this.isMovingImg) {
                    this.lassoHelper.fixImageData(this.drawingService.baseCtx, this.currentLine, this.imageData, this.lassoPath);
                    this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
                    return;
                }
                for (const line of this.lassoPath) {
                    this.drawPath(this.drawingService.previewCtx, line, 'black');
                }
            }
        }
    }

    onMouseMove(mouseMoveEvent: MouseEvent): void {
        if (this.isStarted) {
            this.endPoint = this.getPositionFromMouse(mouseMoveEvent);
            if (this.shiftIsPressed) {
                this.endPoint = this.lineHelper.closestAngledPoint(this.startingPoint, this.endPoint);
                this.angledEndPoint = this.endPoint;
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            for (const line of this.lassoPath) {
                this.drawPath(this.drawingService.previewCtx, line, 'black');
            }
            this.drawPath(this.drawingService.previewCtx, [this.startingPoint, this.endPoint], 'black');
        }
        if (this.changeAnchor && this.mouseDown) {
            this.moveAnchor(mouseMoveEvent);
            return;
        }

        if (this.isPolygonClosed && this.mouseDown && this.isMovingImg) {
            this.moveImageData(mouseMoveEvent.offsetX, mouseMoveEvent.offsetY);
        }
    }

    drawPath(ctx: CanvasRenderingContext2D, path: Vec2[], style: string): void {
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = style;
        ctx.lineWidth = 1;
        if (this.isPolygonClosed) {
            const local: Vec2[] = [
                { x: this.currentLine[0].x, y: this.currentLine[0].y },
                { x: this.currentLine[1].x, y: this.currentLine[1].y },
            ];
            ctx.setLineDash([SEGMENT_TWO, SEGMENT_ONE]);
            this.drawAnchorPoints(this.drawingService.previewCtx, local); //
            // ctx.rect(this.currentLine[0].x, this.currentLine[0].y,this.width, this.height);
        }
        ctx.moveTo(path[0].x, path[0].y);
        ctx.lineTo(path[1].x, path[1].y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    setShiftIsPressed = () => {
        this.shiftIsPressed = true;
        if (this.isStarted && !this.lineHelper.shiftAngleCalculator(this.startingPoint, this.endPoint)) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            for (const line of this.lassoPath) {
                this.drawPath(this.drawingService.previewCtx, line, 'black');
            }
            const angledLine: Vec2[] = [this.startingPoint, this.lineHelper.closestAngledPoint(this.startingPoint, this.endPoint)];
            this.angledEndPoint = angledLine[1];
            this.drawPath(this.drawingService.previewCtx, angledLine, 'black');
        }
        window.removeEventListener('keydown', this.setShiftIsPressed);
        this.blockOnShift = false;
    };

    setShiftNonPressed = (keyUpShiftEvent?: KeyboardEvent) => {
        if ((keyUpShiftEvent != undefined && keyUpShiftEvent.key === 'Shift') || this.calledFromMouseClick) {
            this.shiftIsPressed = false;
            window.removeEventListener('keyup', this.setShiftNonPressed);
            this.blockOnShift = false;
            if (this.isStarted) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                for (const line of this.lassoPath) {
                    this.drawPath(this.drawingService.previewCtx, line, 'black');
                }
                this.drawPath(this.drawingService.previewCtx, [this.startingPoint, this.endPoint], 'black');
            }
        }
    };

    onEscape(): void {
        this.isStarted = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.lassoPath = [];
    }

    onBackSpace(): void {
        if (this.lassoPath.length > 0) {
            this.startingPoint = this.lassoPath[this.lassoPath.length - 1][0];
            this.lassoPath.pop();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            for (const line of this.lassoPath) {
                this.drawPath(this.drawingService.previewCtx, line, 'black');
            }
            this.drawPath(this.drawingService.previewCtx, [this.startingPoint, this.endPoint], 'black');
        }
    }

    checkIfClickOnAnchor(event: MouseEvent): boolean {
        const clickCoords: Vec2 = { x: event.offsetX, y: event.offsetY };
        for (const [index, anchor] of this.anchorPoints.entries()) {
            if (this.lineHelper.distanceUtil(clickCoords, anchor) <= ANCHOR_RADIUS) {
                this.currentAnchor = index;
                return true;
            }
        }
        return false;
    }

    resizeSelection(event: MouseEvent): void {
        if (!this.currentlySelecting) {
            this.backgroundImageData = this.drawingService.baseCtx.getImageData(
                0,
                0,
                this.drawingService.baseCtx.canvas.width,
                this.drawingService.baseCtx.canvas.height,
            );
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        for (const line of this.lassoPath) {
            this.drawPath(this.drawingService.previewCtx, line, 'black');
        }
        this.drawingService.baseCtx.putImageData(this.backgroundImageData, 0, 0);
        createImageBitmap(this.imageData).then((imgBitmap) => {
            this.drawingService.baseCtx.strokeStyle = 'black';
            this.drawingService.baseCtx.globalCompositeOperation = 'source-over';
            this.drawingService.baseCtx.save();
            let horizontalFlip = 1;
            let verticalFlip = 1;
            if (this.currentLine[0].x > this.currentLine[1].x) {
                horizontalFlip = MINUS_ONE;
            }
            if (this.currentLine[0].y > this.currentLine[1].y) {
                verticalFlip = MINUS_ONE;
            }
            let dx: number = this.currentLine[0].x;
            let dy: number = this.currentLine[0].y;

            if (horizontalFlip === MINUS_ONE) {
                dx = -this.currentLine[1].x;
            }
            if (verticalFlip === MINUS_ONE) {
                dy = -this.currentLine[1].y;
            }

            this.drawingService.baseCtx.scale(horizontalFlip, verticalFlip);

            this.drawingService.baseCtx.drawImage(
                imgBitmap,
                dx,
                dy,
                this.currentLine[1].x - this.currentLine[0].x,
                this.currentLine[1].y - this.currentLine[0].y,
            );

            this.drawingService.baseCtx.restore();
        });
    }
}
