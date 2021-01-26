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

    constructor(toolManager: ToolManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.getToolBox();
        for (let tool of this.tools) {
            this.icons.push(tool.icon);
        }
    }

    ngOnInit(): void {}
}
