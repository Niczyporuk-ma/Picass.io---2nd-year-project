import { DrawingService } from '@app/services/drawing/drawing.service';
import { ClipboardService } from '@app/services/tools/clipboard.service';
import { MagnetismService } from '@app/services/tools/magnetism.service';
import { SelectionCommandService } from '@app/services/tools/tool-commands/selection-command.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';
import { Tool } from './tool';
import { Vec2 } from './vec2';

const PIXEL_MODIFIER = 3;
const FIRST_PRESS_WAIT_TIME = 500;
const PRESS_WAIT_TIME = 100;
const ANCHOR_RADIUS = 5;
const INDEX_ANCHOR_INIT = 0;
const INDEX_ANCHOR_MH = 1;
const INDEX_ANCHOR_IH = 2;
const INDEX_ANCHOR_MVI = 3;
const INDEX_ANCHOR_FIN = 4;
const INDEX_ANCHOR_MHI = 5;
const INDEX_ANCHOR_IV = 6;
const INDEX_ANCHOR_MV = 7;

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Selection extends Tool {
    offsetXModifier: number = 0;
    offsetYModifier: number = 0;
    rightArrowCheck: boolean = false;
    leftArrowCheck: boolean = false;
    upArrowCheck: boolean = false;
    downArrowCheck: boolean = false;
    needTimer: boolean = false;
    lastPos: Vec2 = { x: 0, y: 0 };
    currentLine: Vec2[] = [];
    shiftIsPressed: boolean = false;
    anchorPoints: Vec2[];
    currentAnchor: number;
    hasBeenReseted: boolean = false;
    currentlySelecting: boolean = false;
    undoRedoManager: UndoRedoManagerService;
    isMovingImg: boolean = false;
    isStarted: boolean;
    lassoPath: Vec2[][] = [];
    startingPoint: Vec2;
    endPoint: Vec2;
    imageData: ImageData;
    backgroundImageData: ImageData;

    constructor(
        public drawingService: DrawingService,
        undoRedoManager: UndoRedoManagerService,
        public magnetismService: MagnetismService,
        public clipboardService: ClipboardService,
    ) {
        super(drawingService);
        this.localShortcuts = new Map([
            ['Shift', this.onShift],
            ['ArrowRight', this.moveRight],
            ['ArrowLeft', this.moveLeft],
            ['ArrowUp', this.moveUp],
            ['ArrowDown', this.moveDown],
            ['Backspace', this.onBackSpace],
            ['Escape', this.onEscape],
        ]);
        this.undoRedoManager = undoRedoManager;
    }

    fixCurrentLine(): void {
        let tmp: number;
        if (this.currentLine[0].x > this.currentLine[1].x) {
            tmp = this.currentLine[0].x;
            this.currentLine[0].x = this.currentLine[1].x;
            this.currentLine[1].x = tmp;
        }
        if (this.currentLine[0].y > this.currentLine[1].y) {
            tmp = this.currentLine[0].y;
            this.currentLine[0].y = this.currentLine[1].y;
            this.currentLine[1].y = tmp;
        }
    }

    onShift(): void {
        if (!this.shiftIsPressed) {
            window.addEventListener('keydown', this.setShiftIsPressed);
            window.addEventListener('keyup', this.setShiftNonPressed);
            this.shiftIsPressed = true;
        }
    }
    setShiftNonPressed(event: KeyboardEvent): void {}
    setShiftIsPressed(event: KeyboardEvent): void {}

    resetState(): void {
        this.anchorPoints = [];
        this.currentLine = [];
        this.lassoPath = [];
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const selectionCommand: SelectionCommandService = new SelectionCommandService(this.drawingService);
        selectionCommand.imageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        this.undoRedoManager.undoStack.push(selectionCommand);
        this.undoRedoManager.clearRedoStack();
        this.hasBeenReseted = true;
        this.currentlySelecting = false;
        this.isMovingImg = false;
    }

    keyupHandler(e: KeyboardEvent): void {
        switch (e.key) {
            case 'ArrowDown': {
                this.offsetYModifier -= PIXEL_MODIFIER;
                this.downArrowCheck = false;
                break;
            }
            case 'ArrowUp': {
                this.offsetYModifier += PIXEL_MODIFIER;
                this.upArrowCheck = false;
                break;
            }
            case 'ArrowRight': {
                this.offsetXModifier -= PIXEL_MODIFIER;
                this.rightArrowCheck = false;
                break;
            }
            case 'ArrowLeft': {
                this.offsetXModifier += PIXEL_MODIFIER;
                this.leftArrowCheck = false;
                break;
            }
        }
    }

    waitTimer(): void {
        if (this.offsetXModifier === 0 && this.offsetYModifier === 0) {
            setTimeout(() => {}, FIRST_PRESS_WAIT_TIME);
            this.needTimer = false;
        } else {
            setTimeout(() => {}, PRESS_WAIT_TIME);
        }
    }

    moveRight(): void {
        this.waitTimer();
        if (!this.rightArrowCheck) {
            this.offsetXModifier += PIXEL_MODIFIER;
            this.rightArrowCheck = true;
        }
        if (this.magnetismService.isActivated) {
            const newPosition: Vec2 = this.magnetismService.moveRightHandler(this.currentLine);
            this.moveImageData(newPosition.x, newPosition.y);
        } else {
            this.moveImageData(this.lastPos.x + this.offsetXModifier, this.lastPos.y + this.offsetYModifier);
        }
    }

    moveLeft(): void {
        this.waitTimer();
        if (!this.leftArrowCheck) {
            this.offsetXModifier -= PIXEL_MODIFIER;
            this.leftArrowCheck = true;
        }
        if (this.magnetismService.isActivated) {
            const newPosition: Vec2 = this.magnetismService.moveLeftHandler(this.currentLine);
            this.moveImageData(newPosition.x, newPosition.y);
        } else {
            this.moveImageData(this.lastPos.x + this.offsetXModifier, this.lastPos.y + this.offsetYModifier);
        }
    }

    moveUp(): void {
        this.waitTimer();
        if (!this.upArrowCheck) {
            this.offsetYModifier -= PIXEL_MODIFIER;
            this.upArrowCheck = true;
        }
        if (this.magnetismService.isActivated) {
            const newPosition: Vec2 = this.magnetismService.moveUpHandler(this.currentLine);
            this.moveImageData(newPosition.x, newPosition.y);
        } else {
            this.moveImageData(this.lastPos.x + this.offsetXModifier, this.lastPos.y + this.offsetYModifier);
        }
    }

    moveDown(): void {
        this.waitTimer();
        if (!this.downArrowCheck) {
            this.offsetYModifier += PIXEL_MODIFIER;
            this.downArrowCheck = true;
        }
        if (this.magnetismService.isActivated) {
            const newPosition: Vec2 = this.magnetismService.moveDownHandler(this.currentLine);
            this.moveImageData(newPosition.x, newPosition.y);
        } else {
            this.moveImageData(this.lastPos.x + this.offsetXModifier, this.lastPos.y + this.offsetYModifier);
        }
    }

    onEscape(): void {}

    onBackSpace(): void {}

    moveImageData(offsetX: number, offsetY: number): void {}

    drawAnchorPoints(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.anchorPoints = [];

        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'black';

        ctx.beginPath();
        ctx.arc(path[0].x, path[0].y, ANCHOR_RADIUS, 0, Math.PI * 2); // initial

        ctx.fill();

        ctx.beginPath();
        ctx.arc((path[0].x + path[1].x) / 2, path[0].y, ANCHOR_RADIUS, 0, Math.PI * 2); // milieu horizontal
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[1].x, path[0].y, ANCHOR_RADIUS, 0, Math.PI * 2); // inverse horizontal
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[1].x, (path[0].y + path[1].y) / 2, ANCHOR_RADIUS, 0, Math.PI * 2); // milieu vertical inverse
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[1].x, path[1].y, ANCHOR_RADIUS, 0, Math.PI * 2); // fin
        ctx.fill();

        ctx.beginPath();
        ctx.arc((path[0].x + path[1].x) / 2, path[1].y, ANCHOR_RADIUS, 0, Math.PI * 2); // milieu horizontal inverse
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[0].x, path[1].y, ANCHOR_RADIUS, 0, Math.PI * 2); // inverse vertical
        ctx.fill();

        ctx.beginPath();
        ctx.arc(path[0].x, (path[0].y + path[1].y) / 2, ANCHOR_RADIUS, 0, Math.PI * 2); // milieu vertical
        ctx.fill();

        this.setAnchorPoints(path);
    }

    setAnchorPoints(path: Vec2[]): void {
        this.anchorPoints = [];
        this.anchorPoints.push({ x: path[0].x, y: path[0].y });
        this.anchorPoints.push({ x: (path[0].x + path[1].x) / 2, y: path[0].y });
        this.anchorPoints.push({ x: path[1].x, y: path[0].y });
        this.anchorPoints.push({ x: path[1].x, y: (path[0].y + path[1].y) / 2 });
        this.anchorPoints.push({ x: path[1].x, y: path[1].y });
        this.anchorPoints.push({ x: (path[0].x + path[1].x) / 2, y: path[1].y });
        this.anchorPoints.push({ x: path[0].x, y: path[1].y });
        this.anchorPoints.push({ x: path[0].x, y: (path[0].y + path[1].y) / 2 });
    }

    moveAnchor(event: MouseEvent): void {
        switch (this.currentAnchor) {
            case INDEX_ANCHOR_INIT: {
                /*if (this.shiftIsPressed) {
                    if (Math.abs(event.offsetX - this.currentLine[0].x) > Math.abs(event.offsetY - this.currentLine[0].y)) {
                        this.currentLine[0].y += event.offsetX - this.currentLine[0].x;
                        this.currentLine[0].x = event.offsetX;
                        break;
                    } else if (Math.abs(event.offsetX - this.currentLine[0].x) < Math.abs(event.offsetY - this.currentLine[0].y)) {
                        this.currentLine[0].x += event.offsetY - this.currentLine[0].y;
                        this.currentLine[0].y = event.offsetY;
                        break;
                    } else {
                        this.currentLine[0].x = event.offsetX;
                        this.currentLine[0].y = event.offsetY;
                        break;
                    }
                }*/
                this.currentLine[0].x = event.offsetX;
                this.currentLine[0].y = event.offsetY;

                break;
            }
            case INDEX_ANCHOR_MH: {
                this.currentLine[0].y = event.offsetY;
                break;
            }
            case INDEX_ANCHOR_IH: {
                /*if (this.shiftIsPressed) {
                    if (event.offsetX - this.currentLine[1].x >= event.offsetY - this.currentLine[0].y) {
                        this.currentLine[1].x += event.offsetY - this.currentLine[0].y;
                        this.currentLine[0].y += event.offsetY - this.currentLine[0].y;
                        break;
                    } else {
                        this.currentLine[1].x += event.offsetX - this.currentLine[0].y;
                        this.currentLine[0].y += event.offsetX - this.currentLine[0].y;
                        break;
                    }
                }*/
                this.currentLine[0].y = event.offsetY;
                this.currentLine[1].x = event.offsetX;
                break;
            }
            case INDEX_ANCHOR_MVI: {
                this.currentLine[1].x = event.offsetX;
                break;
            }
            case INDEX_ANCHOR_FIN: {
                this.currentLine[1].x = event.offsetX;
                this.currentLine[1].y = event.offsetY;
                break;
            }
            case INDEX_ANCHOR_MHI: {
                this.currentLine[1].y = event.offsetY;
                break;
            }
            case INDEX_ANCHOR_IV: {
                this.currentLine[0].x = event.offsetX;
                this.currentLine[1].y = event.offsetY;
                break;
            }
            case INDEX_ANCHOR_MV: {
                this.currentLine[0].x = event.offsetX;
                break;
            }
            default:
                return;
        }
        this.resizeSelection(event);
    }

    resizeSelection(event: MouseEvent): void {}

    copySelection(): void {
        this.clipboardService.copy = this.imageData;
        this.clipboardService.alreadyCopied = true;
    }
}
