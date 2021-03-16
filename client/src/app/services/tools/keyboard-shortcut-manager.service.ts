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
        if (this.toolManager.allowKeyPressEvents) {
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

    waitForOPress(): void {
        if (!this.toolManager.blockEventListener) {
            this.toolManager.blockEventListener = true;
            window.addEventListener('keydown', (event: KeyboardEvent) => this.OPressHandler(event));
            window.addEventListener('keyup', (event: KeyboardEvent) => this.detectControlO(event));
        }
    }

    waitForEPress(): void {
        if (!this.toolManager.blockEventListener) {
            this.toolManager.blockEventListener = true;
            window.addEventListener('keydown', (event: KeyboardEvent) => this.EPressHandler(event));
            window.addEventListener('keyup', (event: KeyboardEvent) => this.detectControlE(event));
        }
    }

    detectControlO(event: KeyboardEvent): void {
        if (event.key === 'Control') {
            window.removeEventListener('keydown', (e: KeyboardEvent) => this.OPressHandler(e));
            this.toolManager.blockEventListener = false;
        }
    }
    detectControlE(event: KeyboardEvent): void {
        if (event.key === 'Control') {
            window.removeEventListener('keydown', (e: KeyboardEvent) => this.EPressHandler(e));
            this.toolManager.blockEventListener = false;
        }
    }

    OPressHandler(event: KeyboardEvent): void {
        if (event.key === 'o') {
            this.toolManager.clearArrays();
            window.removeEventListener('keydown', (ev: KeyboardEvent) => this.OPressHandler(ev));
            event.preventDefault();
        }
    }

    EPressHandler(event: KeyboardEvent): void {
        if (event.key === 'e') {
            window.removeEventListener('keydown', (ev: KeyboardEvent) => this.EPressHandler(ev));
            event.preventDefault();
            console.log('ctr+e pressed!');
            // TODO: add the right function
        }
    }
}
