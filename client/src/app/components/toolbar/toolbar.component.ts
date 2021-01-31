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
        if (n === 0) {
            this.toolManager.rectangleService.styles.fill = true;
            this.toolManager.rectangleService.styles.lineColor = 'white';
        } else if (n === 1) {
            this.toolManager.rectangleService.styles.fill = false;
            this.toolManager.rectangleService.styles.lineColor = 'red';
        } else {
            this.toolManager.rectangleService.styles.fill = true;
            this.toolManager.rectangleService.styles.lineColor = 'black';
        }
    }
}
