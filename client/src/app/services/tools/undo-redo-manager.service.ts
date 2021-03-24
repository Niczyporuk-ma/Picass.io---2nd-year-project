import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { UndoRedoCommand } from '@app/classes/undo-redo-command';
import { Vec2 } from '@app/classes/vec2';
import { Constant } from '@app/constants/general-constants-store';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeCommandService } from './tool-commands/resize-command.service';

const ZERO = 0;
const WAIT_TIME = 5;
const DEFAULT_CANVAS_SIZE: Vec2 = { x: Constant.DEFAULT_WIDTH, y: Constant.DEFAULT_HEIGHT };

@Injectable({
    providedIn: 'root',
})
export class UndoRedoManagerService extends Tool {
    undoStack: UndoRedoCommand[] = [];
    redoStack: UndoRedoCommand[] = [];
    resizeUndoStack: Vec2[] = [];
    resizeRedoStack: Vec2[] = [];

    undoDisabled: boolean = true;
    redoDisabled: boolean = true;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.undoStack = [];
        this.redoStack = [];
    }

    isEmpty(stack: UndoRedoCommand[]): boolean {
        return stack.length <= 0;
    }

    clearRedoStack(): void {
        this.redoStack = [];
        this.resizeRedoStack = [];
    }

    clearUndoStack(): void {
        this.undoStack = [];
        this.resizeUndoStack = [];
    }

    enableUndoRedo(): void {
        this.undoDisabled = false;
        this.redoDisabled = false;
    }

    disableUndoRedo(): void {
        this.undoDisabled = true;
        this.redoDisabled = true;
    }

    executeAllPreviousCommands(): void {
        for (const command of this.undoStack) {
            if (command.isResizer) {
                const lastResize: Vec2 = this.resizeUndoStack.shift() as Vec2;
                this.resizeUndoStack.push(lastResize);

                const resizeCommand: ResizeCommandService = command as ResizeCommandService;
                resizeCommand.setPreview(lastResize);
                resizeCommand.execute(this.drawingService.baseCtx);
                this.drawImage(resizeCommand);
            } else {
                command.execute(this.drawingService.baseCtx);
            }
        }
    }

    drawImage(resizeCommand: ResizeCommandService): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        setTimeout(() => {
            this.drawingService.baseCtx.drawImage(resizeCommand.lastImage, ZERO, ZERO);
        }, WAIT_TIME);
    }

    undo(): void {
        if (!this.isEmpty(this.undoStack) && !this.undoDisabled) {
            if (this.undoStack[this.undoStack.length - 1].isResizer && this.resizeUndoStack.length <= 1) {
                this.resizeRedoStack.push(this.resizeUndoStack.pop() as Vec2);
                const resizeCommand: ResizeCommandService = this.undoStack[this.undoStack.length - 1] as ResizeCommandService;

                resizeCommand.setPreview(DEFAULT_CANVAS_SIZE);
                resizeCommand.execute(this.drawingService.baseCtx);

                const lastCommand: UndoRedoCommand = this.undoStack.pop() as UndoRedoCommand;
                this.redoStack.push(lastCommand);

                this.drawImage(resizeCommand);
            } else {
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                const lastCommand: UndoRedoCommand = this.undoStack.pop() as UndoRedoCommand;
                this.redoStack.push(lastCommand);
                if (lastCommand.isResizer) {
                    const lastResize: Vec2 = this.resizeUndoStack.pop() as Vec2;
                    const resize: ResizeCommandService = lastCommand as ResizeCommandService;
                    this.resizeRedoStack.push(lastResize);
                    setTimeout(() => {
                        this.drawImage(resize);
                    }, WAIT_TIME);
                }
            }
            this.executeAllPreviousCommands();
        }
    }

    redo(): void {
        if (!this.isEmpty(this.redoStack) && !this.redoDisabled) {
            const lastCommand: UndoRedoCommand = this.redoStack.pop() as UndoRedoCommand;
            this.undoStack.push(lastCommand);

            if (lastCommand.isResizer) {
                const lastResize: Vec2 = this.resizeRedoStack.pop() as Vec2;
                const resizeCommand: ResizeCommandService = lastCommand as ResizeCommandService;
                this.resizeUndoStack.push(lastResize);

                resizeCommand.setPreview(lastResize);
                resizeCommand.execute(this.drawingService.baseCtx);

                this.drawImage(resizeCommand);
            } else {
                lastCommand.execute(this.drawingService.baseCtx);
            }
        }
    }
}
