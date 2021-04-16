import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyboardShortcutManagerService } from './keyboard-shortcut-manager.service';

describe('KeyboardShortcutManagerService', () => {
    let service: KeyboardShortcutManagerService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let ctxSpyObject: jasmine.SpyObj<CanvasRenderingContext2D>;

    beforeEach(() => {
        // tslint:disable:no-magic-numbers
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        ctxSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', ['clearRect']);
        drawingServiceSpy.previewCtx = ctxSpyObject;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(KeyboardShortcutManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onKeyPress should call localShortcutHandler when the shortcut exists within the current tool', () => {
        service.toolManager.setTool(service.toolManager.rectangleService);
        const currentToolSpy = spyOn(service.toolManager.currentTool, 'localShortCutHandler').and.callThrough();
        service.onKeyPress('Shift');
        expect(currentToolSpy).toHaveBeenCalled();
    });

    it(' onKeyPress should call setTool when the shortcut does not exist within the current tool but it is used to change to another tool', () => {
        service.toolManager.setTool(service.toolManager.rectangleService);
        const toolManagerSpy = spyOn(service.toolManager, 'setTool');
        service.onKeyPress('e');
        expect(toolManagerSpy).toHaveBeenCalled();
    });

    it(' onKeyPress should not call setTool or localShortcutHandler if the shorcut does not exist', () => {
        const currentToolSpy = spyOn(service.toolManager.currentTool, 'localShortCutHandler');
        const toolManagerSpy = spyOn(service.toolManager, 'setTool');
        service.onKeyPress('!2_k');
        expect(toolManagerSpy).not.toHaveBeenCalled();
        expect(currentToolSpy).not.toHaveBeenCalled();
    });

    it(' onKeyPress should set the witdhValue of the tool manager when the shortcut is used to change to another tool', () => {
        service.toolManager.setTool(service.toolManager.rectangleService);
        service.toolManager.eraserService.toolStyles.lineWidth = 14;
        service.onKeyPress('e');
        expect(service.toolManager.widthValue).toEqual(14);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('onKeyPress should do nothing if allowKeyPressEvents is false', () => {
        const hasSpy = spyOn(service.toolManager.currentTool.localShortcuts, 'has').and.stub();
        service.toolManager.allowKeyPressEvents = false;
        service.toolManager.currentTool = service.toolManager.pencilService;
        service.onKeyPress('e');
        expect(hasSpy).not.toHaveBeenCalled();
    });
});
