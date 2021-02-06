import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    tools: Tool[];
    toolManager: ToolManagerService;
    showPalette: boolean = false;
    widthValue: number = 1;

    constructor(toolManager: ToolManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
    }
    setRectangleStyle(n: number): void {
        if (n == 3) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.toolStyles.lineColor = 'white';
        } else if (n == 4) {
            this.toolManager.rectangleService.toolStyles.fill = false;
            this.toolManager.rectangleService.toolStyles.lineColor = 'red';
        } else if (n == 5) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.toolStyles.lineColor = 'black';
        }
    }

    onPress(): void {
        this.showPalette = !this.showPalette;
    }

    setEllipseStyle(n: number): void {
        this.toolManager.ellipseService.toolStyles.fill = false;
        this.toolManager.ellipseService.border = false;

        if (n === 0) {
            this.toolManager.ellipseService.toolStyles.fill = true;
        } else if (n === 1) {
            this.toolManager.ellipseService.border = true;
        } else {
            this.toolManager.ellipseService.toolStyles.fill = true;
            this.toolManager.ellipseService.border = true;
        }
    }

    changeWidth(width: number): void {
        this.toolManager.currentTool.changeWidth(width);
        this.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
    }
}
