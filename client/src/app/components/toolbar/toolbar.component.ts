import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { GridService } from '@app/services/grid/grid.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import {
    faBars,
    faEraser,
    faEyeDropper,
    faPalette,
    faPen,
    faPlay,
    faRedoAlt,
    faSlash,
    faSprayCan,
    faStamp,
    faTh,
    faUndoAlt,
    faVectorSquare,
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
    faBars: IconDefinition = faBars;
    faEyeDropper: IconDefinition = faEyeDropper;
    faSprayCan: IconDefinition = faSprayCan;
    faUndoAlt: IconDefinition = faUndoAlt;
    faRedoAlt: IconDefinition = faRedoAlt;
    faTh: IconDefinition = faTh;
    faStamp: IconDefinition = faStamp;
    faVectorSquare: IconDefinition = faVectorSquare;
    faPlay: IconDefinition = faPlay;

    constructor(public toolManager: ToolManagerService, public undoRedoManager: UndoRedoManagerService, public gridService: GridService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
        this.undoRedoManager = undoRedoManager;
        this.shortcuts.push({
            key: 'g',
            preventDefault: false,
            command: () => {
                if (!this.toolManager.textService.textBoxActive) {
                    this.gridService.showGrid();
                }
            },
        });
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

    changeGridOpacity(opacity: number): void {
        this.gridService.lineOpacity = opacity;
        this.gridService.drawGrid();
    }

    changeSquareSize(size: number): void {
        this.gridService.squareSize = size;
        this.gridService.drawGrid();
    }

    rotateStamp(rotationAngle: number): void {
        this.toolManager.stampService.rotationAngle = rotationAngle;
    }

    changeStampSize(newSize: number): void {
        this.toolManager.stampService.stampSize = newSize;
    }

    setStampStyle(stampNb: number): void {
        this.toolManager.stampService.stampName = 'assets/' + stampNb + '.png';
    }
}
