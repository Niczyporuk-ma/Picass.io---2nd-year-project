import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { faCircle, faPlusSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { faEraser, faPalette, faPen, faSlash } from '@fortawesome/free-solid-svg-icons';

const FILL_VALUE  = '1';
const CONTOUR_VALUE  = '2';
const BOTH_VALUE  = '3';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    tools: Tool[];
    showAdvanced: boolean = false;
    showPalette: boolean = false;
    widthValue: number = this.toolManager.currentTool.toolStyles.lineWidth;
    faPen = faPen;
    faSquare = faSquare;
    faSlash = faSlash;
    faEraser = faEraser;
    faCircle = faCircle;
    faPalette = faPalette;
    faPlusSquare = faPlusSquare;
    

    constructor(public toolManager: ToolManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
    }

    setRectangleStyle(n: string): void {
        
        if (n  === FILL_VALUE) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.contour = false;
        } else if (n  === CONTOUR_VALUE) {
            this.toolManager.rectangleService.toolStyles.fill = false;
            this.toolManager.rectangleService.contour = true;
        } else if (n  === BOTH_VALUE) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.contour = true;
        }
    }

    onPressPalette(): void {
        this.showPalette = !this.showPalette;
    }

    setEllipseStyle(n: string): void {
        if (n === FILL_VALUE) {
            this.toolManager.ellipseService.toolStyles.fill = true;
            this.toolManager.ellipseService.border = false;
        } else if (n === CONTOUR_VALUE) {
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

    setLineJunction(n: number): void {
        if (n == 0) {
            this.toolManager.lineService.hasJunction = false;
        } else {
            this.toolManager.lineService.hasJunction = true;
        }
    }

    changeDiameter(n: number): void {
        this.toolManager.lineService.currentDiameter = n;
    }

    changeWidth(width: number): void {
        this.toolManager.currentTool.changeWidth(width);
        this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
    }
}
