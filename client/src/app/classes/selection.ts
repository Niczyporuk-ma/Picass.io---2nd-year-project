import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionCommandService } from '@app/services/tools/tool-commands/selection-command.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';
import { Tool } from './tool';
import { Vec2 } from './vec2';

const PIXEL_MODIFIER = 3;
const FIRST_PRESS_WAIT_TIME = 500;
const PRESS_WAIT_TIME = 100;

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
    currentLine: Vec2[];
    shiftIsPressed: boolean;
    anchorPoints: Vec2[];
    hasBeenReseted: boolean = false;
    currentlySelecting: boolean = false;
    undoRedoManager: UndoRedoManagerService;

    constructor(public drawingService: DrawingService, undoRedoManager: UndoRedoManagerService) {
        super(drawingService);
        this.localShortcuts = new Map([
            ['Shift', this.onShift],
            ['ArrowRight', this.moveRight],
            ['ArrowLeft', this.moveLeft],
            ['ArrowUp', this.moveUp],
            ['ArrowDown', this.moveDown],
        ]);
        this.undoRedoManager = undoRedoManager;
        this.toolName = 'Selection';
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
        this.moveImageData(this.lastPos.x + this.offsetXModifier, this.lastPos.y + this.offsetYModifier);
    }

    moveLeft(): void {
        this.waitTimer();
        if (!this.leftArrowCheck) {
            this.offsetXModifier -= PIXEL_MODIFIER;
            this.leftArrowCheck = true;
        }
        this.moveImageData(this.lastPos.x + this.offsetXModifier, this.lastPos.y + this.offsetYModifier);
    }

    moveUp(): void {
        this.waitTimer();
        if (!this.upArrowCheck) {
            this.offsetYModifier -= PIXEL_MODIFIER;
            this.upArrowCheck = true;
        }
        this.moveImageData(this.lastPos.x + this.offsetXModifier, this.lastPos.y + this.offsetYModifier);
    }

    moveDown(): void {
        this.waitTimer();
        if (!this.downArrowCheck) {
            this.offsetYModifier += PIXEL_MODIFIER;
            this.downArrowCheck = true;
        }
        this.moveImageData(this.lastPos.x + this.offsetXModifier, this.lastPos.y + this.offsetYModifier);
    }

    moveImageData(offsetX: number, offsetY: number): void {}
}
