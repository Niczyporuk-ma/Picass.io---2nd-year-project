import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Injectable({
    providedIn: 'root',
})
export class KeyboardShortcutManagerService {
    currentCommand: Function = () => {};
    toolManager: ToolManagerService;
    nextTool: Tool;

    constructor(private toolManagerService: ToolManagerService) {
        this.toolManager = toolManagerService;
    }

    onKeyPress(key: string): void {
        if (this.toolManagerService.currentTool.getLocalShorcuts().has(key)) {
            this.toolManager.currentTool.localShortCutHandler(key);
        } else {
            if (this.toolManagerService.toolBoxShortcuts.has(key)) {
                this.toolManager.setTool(<Tool>this.toolManager.toolBoxShortcuts.get(key));
            }
        }
    }
}
