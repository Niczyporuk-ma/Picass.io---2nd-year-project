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
});
