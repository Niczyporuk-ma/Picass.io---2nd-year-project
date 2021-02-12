import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { faCircle, faSquare } from '@fortawesome/free-regular-svg-icons';
import { faEraser, faPalette, faPen, faSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    tools: Tool[];
    // toolManager: ToolManagerService;
    showAdvanced: boolean = false;
    showPalette: boolean = false;
    widthValue: number = this.toolManager.currentTool.toolStyles.lineWidth;
    faPen = faPen;
    faSquare = faSquare;
    faSlash = faSlash;
    faEraser = faEraser;
    faCircle = faCircle;
    faPalette = faPalette;

    constructor(public toolManager: ToolManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
    }

    setRectangleStyle(n: number): void {
        if (n == 3) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.contour = false;
        } else if (n == 4) {
            this.toolManager.rectangleService.toolStyles.fill = false;
            this.toolManager.rectangleService.contour = true;
        } else if (n == 5) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.contour = true;
        }
    }

    onPress(): void {
        this.showAdvanced = !this.showAdvanced;
    }

    onPressPalette(): void {
        this.showPalette = !this.showPalette;
    }

    setEllipseStyle(n: number): void {
        if (n == 0) {
            this.toolManager.ellipseService.toolStyles.fill = true;
            this.toolManager.ellipseService.border = false;
        } else if (n == 1) {
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

    changeWidth(width: number): void {
        this.toolManager.currentTool.changeWidth(width);
        this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
    }
}
