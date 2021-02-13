import { TestBed } from '@angular/core/testing';
// import{Tool} from '@app/classes/tool';
import { KeyboardShortcutManagerService } from './keyboard-shortcut-manager.service';

describe('KeyboardShortcutManagerService', () => {
    let service: KeyboardShortcutManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(KeyboardShortcutManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' onKeyPress should call localShortcutHandler when the shortcut exists within the current tool', () => {
        service.toolManager.setTool(service.toolManager.rectangleService);
        const currentToolSpy = spyOn<any>(service.toolManager.currentTool, 'localShortCutHandler');
        service.onKeyPress('Shift');
        expect(currentToolSpy).toHaveBeenCalled();
    });

    it(' onKeyPress should call setTool when the shortcut does not exist within the current tool but it is used to change to another tool', () => {
        service.toolManager.setTool(service.toolManager.rectangleService);
        const toolManagerSpy = spyOn<any>(service.toolManager, 'setTool');
        service.onKeyPress('e');
        expect(toolManagerSpy).toHaveBeenCalled();
    });

    it(' onKeyPress should not call setTool or localShortcutHandler if the shorcut does not exist', () => {
        const currentToolSpy = spyOn<any>(service.toolManager.currentTool, 'localShortCutHandler');
        const toolManagerSpy = spyOn<any>(service.toolManager, 'setTool');
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

    it(' OPressHandler should remove the event listener when o is pressed', () => {
        const eventListenerSpy = spyOn(window,'removeEventListener').and.callThrough();
        const event = {key :'o', preventDefault : () =>{}} as KeyboardEvent;
        service.OPressHandler(event);
        expect(eventListenerSpy).toHaveBeenCalled();
    });

    it(' OPressHandler should call preventDefaut of the event passed to it', () => {
        const event = {key :'o', preventDefault : () =>{}} as KeyboardEvent;
        const preventDefaultSpy = spyOn(event, 'preventDefault');
        service.OPressHandler(event);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it(' waitForOpress should add two event listener', () => {
        const eventListenerSpy = spyOn(window,'addEventListener').and.stub();
        service.waitForOPress();
        expect(eventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it(' waitForOpress should set blockEventListener to true', () => {
        service.waitForOPress();
        expect(service.toolManager.blockEventListener).toEqual(true);
    });

    it(' waitForOpress sets blockEventsListener to false Control is unpressed', async (done) => {
        const event = new KeyboardEvent('keyup',{key :'Control'});
        service.waitForOPress();
        window.dispatchEvent(event);
        setTimeout(() => {
            expect(service.toolManager.blockEventListener).toEqual(false);
            done();
        }, 200);
    });

    it(' waitForOpress removes the event listener when Controlis unpressed', async (done) => {
        const event = new KeyboardEvent('keyup',{key :'Control'});
        const eventListenerSpy = spyOn(window,'removeEventListener').and.stub();
        service.waitForOPress();
        window.dispatchEvent(event);
        setTimeout(() => {
            expect(eventListenerSpy).toHaveBeenCalled();
            done();
        }, 200);
    });

});
