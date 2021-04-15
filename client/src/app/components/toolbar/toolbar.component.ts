import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import {
    faBars, faEraser,
    faEyeDropper,
    faPalette,
    faPen,
    faRedoAlt,
    faSlash,
    faSprayCan,
    faUndoAlt
} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    tools: Tool[];
    showAdvanced: boolean = false;
    widthValue: number = this.toolManager.currentTool.toolStyles.lineWidth;
    faPen: IconDefinition = faPen;
    faSquare: IconDefinition = faSquare;
    faSlash: IconDefinition = faSlash;
    faEraser: IconDefinition = faEraser;
    faCircle: IconDefinition = faCircle;
    faPalette: IconDefinition = faPalette;
    faEyeDropper: IconDefinition = faEyeDropper;
    faSprayCan: IconDefinition = faSprayCan;
    faUndoAlt: IconDefinition = faUndoAlt;
    faRedoAlt: IconDefinition = faRedoAlt;
    faBars: IconDefinition = faBars;

    constructor(public toolManager: ToolManagerService, public undoRedoManager: UndoRedoManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
        this.undoRedoManager = undoRedoManager;
    }

    onPressPalette(): void {
        this.toolManager.showPalette = !this.toolManager.showPalette;
    }

    showSaveDrawing(): void {
        this.toolManager.showSaveMenu = !this.toolManager.showSaveMenu;
    }
    
    disableShortcut(): void {
        this.toolManager.allowKeyPressEvents = false;
    }
    
    enableShortcut(): void {
        this.toolManager.allowKeyPressEvents = true;
    }

    updateSliderWidth(): void {
        this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
      }
    
}
