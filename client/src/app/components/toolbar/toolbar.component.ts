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
    public showPalette = false;

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

    onPress() {
        this.showPalette = !this.showPalette;
    }
    ngOnInit(): void {}

    setEllipseStyle(n: number): void {
        this.toolManager.ellipseService.fill = false;
        this.toolManager.ellipseService.border = false;

        if (n == 0) {
            this.toolManager.ellipseService.fill = true;
        } else if (n == 1) {
            this.toolManager.ellipseService.border = true;
        } else {
            this.toolManager.ellipseService.fill = true;
            this.toolManager.ellipseService.border = true;
        }
    }
}
