import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faPlusSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { faDownload, faEraser, faPalette, faPen, faSlash } from '@fortawesome/free-solid-svg-icons';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

const FILL_VALUE = '1';
const CONTOUR_VALUE = '2';

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
    faPlusSquare: IconDefinition = faPlusSquare;
    faDownload: IconDefinition = faDownload;

    constructor(public toolManager: ToolManagerService, public modal: MatDialog, private _hotkeysService: HotkeysService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
        //  Source: https://www.npmjs.com/package/angular2-hotkeys
        this._hotkeysService.add(
            new Hotkey('ctrl+e', (event: KeyboardEvent): boolean => {
                console.log('ctrl+e hotkey');
                this.export();
                return false; // Prevent bubbling
            }),
        );
        this._hotkeysService.add(
            new Hotkey('ctrl+o', (event: KeyboardEvent): boolean => {
                console.log('ctrl+o hotkey');
                this.toolManager.clearArrays();
                return false; // Prevent bubbling
            }),
        );
    }

    setRectangleStyle(recStyleCode: string): void {
        if (recStyleCode === FILL_VALUE) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.contour = false;
        } else if (recStyleCode === CONTOUR_VALUE) {
            this.toolManager.rectangleService.toolStyles.fill = false;
            this.toolManager.rectangleService.contour = true;
        } else {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.contour = true;
        }
    }

    onPressPalette(): void {
        this.toolManager.showPalette = !this.toolManager.showPalette;
    }

    setEllipseStyle(ellipseStyleCode: string): void {
        if (ellipseStyleCode === FILL_VALUE) {
            this.toolManager.ellipseService.toolStyles.fill = true;
            this.toolManager.ellipseService.border = false;
        } else if (ellipseStyleCode === CONTOUR_VALUE) {
            this.toolManager.ellipseService.toolStyles.fill = false;
            this.toolManager.ellipseService.border = true;
        } else {
            this.toolManager.ellipseService.toolStyles.fill = true;
            this.toolManager.ellipseService.border = true;
        }
    }

    updateSliderWidth(): void {
        this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
    }

    setLineJunction(n: string): void {
        if (n === '0') {
            this.toolManager.lineService.hasJunction = false;
        } else {
            this.toolManager.lineService.hasJunction = true;
        }
    }

    changeDiameter(newDiameter: number): void {
        this.toolManager.lineService.currentDiameter = newDiameter;
    }

    changeWidth(width: number): void {
        this.toolManager.currentTool.changeWidth(width);
        this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
    }

    export(): void {
        this.modal.open(ExportDrawingComponent);
    }
}
