import { Component, OnInit } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { faPencilAlt, faSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
    tools: Tool[];
    faPencilAlt = faPencilAlt;
    faSlash = faSlash;
    icons: any[] = [];
    toolManager: ToolManagerService;
    public showPalette = false;

    constructor(toolManager: ToolManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.getToolBox();
        for (let tool of this.tools) {
            this.icons.push(tool.icon);
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
