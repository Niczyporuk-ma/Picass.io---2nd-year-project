import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Injectable({
    providedIn: 'root',
})
export class KeyboardShortcutManagerService {
    constructor(private toolManagerService: ToolManagerService, public drawingService: DrawingService) {
        this.toolManager = toolManagerService;
    }
    toolManager: ToolManagerService;

    onKeyPress(key: string): void {
        if (this.toolManager.allowKeyPressEvents) {
            if (this.toolManagerService.currentTool.localShortcuts.has(key)) {
                this.toolManager.currentTool.localShortCutHandler(key);
            } else {
                if (this.toolManagerService.toolBoxShortcuts.has(key)) {
                    this.toolManager.setTool(this.toolManager.toolBoxShortcuts.get(key) as Tool);
                    this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
                    this.drawingService.clearCanvas(this.drawingService.previewCtx);
                }
            }
        }
    }
}
