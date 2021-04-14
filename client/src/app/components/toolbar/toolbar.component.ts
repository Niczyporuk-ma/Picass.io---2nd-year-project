import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { FormComponent } from '@app/components/form/form.component';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faPlusSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import {
    faDownload,
    faEraser,
    faEyeDropper,
    faImages,
    faPalette,
    faPen,
    faRedoAlt,
    faSave,
    faSlash,
    faSprayCan,
    faUndoAlt
} from '@fortawesome/free-solid-svg-icons';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    shortcuts: ShortcutInput[] = [];
    tools: Tool[];
    showAdvanced: boolean = false;
    widthValue: number = this.toolManager.currentTool.toolStyles.lineWidth;
    faPen: IconDefinition = faPen;
    faSquare: IconDefinition = faSquare;
    faSlash: IconDefinition = faSlash;
    faEraser: IconDefinition = faEraser;
    faCircle: IconDefinition = faCircle;
    faPalette: IconDefinition = faPalette;
    faPlusSquare: IconDefinition = faPlusSquare;
    faDownload: IconDefinition = faDownload;
    faEyeDropper: IconDefinition = faEyeDropper;
    faSprayCan: IconDefinition = faSprayCan;
    faImages: IconDefinition = faImages;
    faSave: IconDefinition = faSave;
    faUndoAlt: IconDefinition = faUndoAlt;
    faRedoAlt: IconDefinition = faRedoAlt;

    constructor(public toolManager: ToolManagerService, public undoRedoManager: UndoRedoManagerService, public modal: MatDialog) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
        // source: https://www.npmjs.com/package/ng-keyboard-shortcuts
        this.shortcuts.push(
            {
                key: 'ctrl + g',
                preventDefault: true,
                command: () => this.openCarousel(),
            },
            {
                key: 'ctrl + s',
                preventDefault: true,
                command: () => this.openSaveDrawingForm(),
            },
        );
        this.shortcuts.push({
            key: 'ctrl + e',
            preventDefault: true,
            command: () => this.export(),
        });
        this.undoRedoManager = undoRedoManager;
    }

    onPressPalette(): void {
        this.toolManager.showPalette = !this.toolManager.showPalette;
    }

    showSaveDrawing(): void {
        this.toolManager.showSaveMenu = !this.toolManager.showSaveMenu;
    }

    export(): void {
        this.modal.open(ExportDrawingComponent);
    }

    disableShortcut(): void {
        this.toolManager.allowKeyPressEvents = false;
    }

    enableShortcut(): void {
        this.toolManager.allowKeyPressEvents = true;
    }

    openCarousel(): void {
        this.modal.open(CarrouselComponent);
    }

    openSaveDrawingForm(): void {
        this.modal.open(FormComponent);
    }

    updateSliderWidth(): void {
        this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
      }
    
}
