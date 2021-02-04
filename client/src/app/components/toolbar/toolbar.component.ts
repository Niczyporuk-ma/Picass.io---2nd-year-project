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

    constructor(toolManager: ToolManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
    }
    setRectangleStyle(n: number): void {
<<<<<<< HEAD
        if (n == 0) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.toolStyles.lineColor = 'white';
        } else if (n == 1) {
            this.toolManager.rectangleService.toolStyles.fill = false;
            this.toolManager.rectangleService.toolStyles.lineColor = 'red';
=======
        if (n === 0) {
            this.toolManager.rectangleService.styles.fill = true;
            this.toolManager.rectangleService.styles.lineColor = 'white';
        } else if (n === 1) {
            this.toolManager.rectangleService.styles.fill = false;
            this.toolManager.rectangleService.styles.lineColor = 'red';
>>>>>>> 0728b6cdb76bf3154bcc75deb2a016c4733c3e6a
        } else {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.toolStyles.lineColor = 'black';
        }
    }

    onPress(): void {
        this.showPalette = !this.showPalette;
    }

    setEllipseStyle(n: number): void {
        this.toolManager.ellipseService.styles.fill = false;
        this.toolManager.ellipseService.border = false;

        if (n === 0) {
            this.toolManager.ellipseService.styles.fill = true;
        } else if (n === 1) {
            this.toolManager.ellipseService.border = true;
        } else {
            this.toolManager.ellipseService.styles.fill = true;
            this.toolManager.ellipseService.border = true;
        }
    }
}
