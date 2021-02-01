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

    constructor(toolManager: ToolManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
    }
    setRectangleStyle(n: number): void {
        if (n == 0) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.toolStyles.lineColor = 'white';
        } else if (n == 1) {
            this.toolManager.rectangleService.toolStyles.fill = false;
            this.toolManager.rectangleService.toolStyles.lineColor = 'red';
        } else {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.toolStyles.lineColor = 'black';
        }
    }
}
