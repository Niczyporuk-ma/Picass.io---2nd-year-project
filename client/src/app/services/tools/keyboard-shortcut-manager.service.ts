import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Injectable({
    providedIn: 'root',
})
export class KeyboardShortcutManagerService {
    constructor(private toolManagerService: ToolManagerService) {
        this.toolManager = toolManagerService;
    }
    toolManager: ToolManagerService;

    onKeyPress(key: string): void {
        if (this.toolManagerService.currentTool.localShortcuts.has(key)) {
            this.toolManager.currentTool.localShortCutHandler(key);
        } else {
            if (this.toolManagerService.toolBoxShortcuts.has(key)) {
                this.toolManager.setTool(this.toolManager.toolBoxShortcuts.get(key) as Tool);
                this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
            }
        }
    }
}
