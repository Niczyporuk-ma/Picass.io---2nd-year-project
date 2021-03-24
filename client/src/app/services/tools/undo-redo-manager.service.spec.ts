import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { UndoRedoCommand } from '@app/classes/undo-redo-command';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilCommandService } from './tool-commands/pencil-command.service';
import { UndoRedoManagerService } from './undo-redo-manager.service';

describe('UndoRedoManagerService', () => {
    let service: UndoRedoManagerService;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        // Configuration du spy
        // tslint:disable:no-string-literal
        // tslint:disable:no-magic-numbers
        // tslint:disable:max-file-line-count
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'clearBackground']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service = TestBed.inject(UndoRedoManagerService);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('stack should be empty', () => {
        const stack: UndoRedoCommand[] = [];
        expect(service.isEmpty(stack)).toBeTrue();
    });

    it('redoStack should be empty after clearRedoStack is called', () => {
        const command: PencilCommandService = new PencilCommandService();
        service.redoStack.push(command);
        service.clearRedoStack();
        expect(service.redoStack.length).toEqual(0);
    });

    it('resizeRedoStack should be empty after clearRedoStack is called', () => {
        const resize: Vec2 = { x: 500, y: 500 };
        service.resizeRedoStack.push(resize);
        service.clearRedoStack();
        expect(service.resizeRedoStack.length).toEqual(0);
    });

    it('undoStack should be empty after clearRedoStack is called', () => {
        const command: PencilCommandService = new PencilCommandService();
        service.undoStack.push(command);
        service.clearUndoStack();
        expect(service.undoStack.length).toEqual(0);
    });

    it('resizeUndoStack should be empty after clearRedoStack is called', () => {
        const resize: Vec2 = { x: 500, y: 500 };
        service.resizeUndoStack.push(resize);
        service.clearUndoStack();
        expect(service.resizeUndoStack.length).toEqual(0);
    });

    it('undoDisabled should be false after calling enableUndoRedo()', () => {
        service.undoDisabled = true;
        service.enableUndoRedo();
        expect(service.undoDisabled).toEqual(false);
    });

    it('redoDisabled should be false after calling enableUndoRedo()', () => {
        service.redoDisabled = true;
        service.enableUndoRedo();
        expect(service.redoDisabled).toEqual(false);
    });

    it('undoDisabled should be true after calling disableUndoRedo()', () => {
        service.undoDisabled = false;
        service.disableUndoRedo();
        expect(service.undoDisabled).toEqual(true);
    });

    it('redoDisabled should be true after calling disableUndoRedo()', () => {
        service.redoDisabled = false;
        service.disableUndoRedo();
        expect(service.redoDisabled).toEqual(true);
    });

    it('calling undo should push what was popped from undoStack onto redoStack if undoStack is not empty, undo is not disabled, the last undo isnt a resize', () => {
        const pencilCommand: PencilCommandService = new PencilCommandService();
        service.undoStack = [pencilCommand];
        service.undoDisabled = false;
        service.resizeUndoStack = [];
        service.resizeRedoStack = [];
        service.undo();
        expect(service.undoStack.length).toEqual(0);
        expect(service.redoStack.length).toEqual(1);
    });
});
