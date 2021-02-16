import { TestBed } from '@angular/core/testing';
// import{Tool} from '@app/classes/tool';
import { KeyboardShortcutManagerService } from './keyboard-shortcut-manager.service';

describe('KeyboardShortcutManagerService', () => {
    let service: KeyboardShortcutManagerService;

    beforeEach(() => {
        // tslint:disable:no-magic-numbers
        TestBed.configureTestingModule({});
        service = TestBed.inject(KeyboardShortcutManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onKeyPress should call localShortcutHandler when the shortcut exists within the current tool', () => {
        service.toolManager.setTool(service.toolManager.rectangleService);
        const currentToolSpy = spyOn(service.toolManager.currentTool, 'localShortCutHandler');
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
    });

    it('onKeyPress should do nothing if allowKeyPressEvents is false', () => {
        const hasSpy = spyOn(service.toolManager.currentTool.localShortcuts, 'has').and.stub();
        service.toolManager.allowKeyPressEvents = false;
        service.toolManager.currentTool = service.toolManager.pencilService;
        service.onKeyPress('e');
        expect(hasSpy).not.toHaveBeenCalled();
    });

    it(' OPressHandler should remove the event listener when o is pressed', () => {
        const eventListenerSpy = spyOn(window, 'removeEventListener').and.callThrough();
        const preventDefaultSpy = jasmine.createSpyObj('e', ['preventDefault']);
        const event = { key: 'o', preventDefault: preventDefaultSpy.preventDefault } as KeyboardEvent;
        service.OPressHandler(event);
        expect(eventListenerSpy).toHaveBeenCalled();
    });

    it(' OPressHandler should call preventDefaut of the event passed to it', () => {
        const preventDefaultSpy = jasmine.createSpyObj('e', ['preventDefault']);
        const event = { key: 'o', preventDefault: preventDefaultSpy.preventDefault } as KeyboardEvent;
        service.OPressHandler(event);
        expect(preventDefaultSpy.preventDefault).toHaveBeenCalled();
    });

    it('OPressHandler does nothing if key isnt o', () => {
        const event = new KeyboardEvent('keydown', { key: 'A' });
        const removeEventListenerSpy = spyOn(window, 'removeEventListener').and.stub();
        service.OPressHandler(event);
        expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    it(' waitForOpress should add three event listener', () => {
        const eventListenerSpy = spyOn(window, 'addEventListener').and.stub();
        service.waitForOPress();
        expect(eventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it(' waitForOpress should do nothing if blockEventListener is true', () => {
        service.toolManager.blockEventListener = true;
        const eventListenerSpy = spyOn(window, 'addEventListener').and.stub();
        service.waitForOPress();
        expect(eventListenerSpy).not.toHaveBeenCalled();
    });

    it(' waitForOpress should set blockEventListener to true if it was false', () => {
        service.toolManager.blockEventListener = false;
        service.waitForOPress();
        expect(service.toolManager.blockEventListener).toEqual(true);
    });

    it(' waitForOpress sets blockEventsListener to false Control is unpressed', async (done) => {
        const event = new KeyboardEvent('keyup', { key: 'Control' });
        service.waitForOPress();
        window.dispatchEvent(event);
        setTimeout(() => {
            expect(service.toolManager.blockEventListener).toEqual(false);
            done();
        }, 200);
    });

    it('detectControl does nothing if key isnt Control', () => {
        const event = new KeyboardEvent('keydown', { key: 'A' });
        const removeEventListenerSpy = spyOn(window, 'removeEventListener').and.stub();
        service.detectControl(event);
        expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    it(' waitForOpress removes the event listener when Controlis unpressed', async (done) => {
        const event = new KeyboardEvent('keyup', { key: 'Control' });
        const eventListenerSpy = spyOn(window, 'removeEventListener').and.stub();
        service.waitForOPress();
        window.dispatchEvent(event);
        setTimeout(() => {
            expect(eventListenerSpy).toHaveBeenCalled();
            done();
        }, 200);
    });
});
