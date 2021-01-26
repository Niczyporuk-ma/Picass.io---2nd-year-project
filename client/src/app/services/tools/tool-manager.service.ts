import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { LineServiceService } from '@app/services/tools/line-service.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { Subject } from 'rxjs';
import { EraserService } from './eraser.service';
import { RectangleService } from './rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    nextTool: Tool;
    public test: Subject<Function> = new Subject<Function>();
    currentToolChange: Subject<Tool> = new Subject<Tool>();
    private currentTool: Tool;

    tools: Tool[] = [this.pencilService, this.lineService, this.rectangleService, this.eraserService];
    toolBoxShortcuts: Map<string, Tool> = new Map([
        // probleme avec les getShorcutValue()
        ['l', this.tools[1]],
        ['r', this.tools[2]],
        ['e', this.tools[3]],
        ['p', this.tools[0]],
    ]);

    constructor(
        private pencilService: PencilService,
        private lineService: LineServiceService,
        private rectangleService: RectangleService,
        private eraserService: EraserService,
    ) {
        this.currentTool = this.pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = value));
    }
    

        //Faire un for pour initialiser la map

        // for (let tool of this.tools) {
        //     this.toolShortcuts.set(tool.shortcut.toString(), tool);
        // }
  

    setTool(tool: Tool) {
        this.currentToolChange.next(tool);
    }


    getCurrentTool(): Tool {
        return this.currentTool;
    }

    getToolBoxShortcuts(): Map<string, Tool> {
        return this.toolBoxShortcuts;
    }

    getRectangleService(): Tool {
        return this.rectangleService;
    }

    getEraserService(): Tool {
        return this.eraserService;
    }

    getPencilService(): PencilService {
        return this.pencilService;
    }

    getLineService(): LineServiceService {
        return this.lineService;
    }

    setPencilService(): void {
        this.currentToolChange.next(this.pencilService);
    }

    setLineService(): void {
        this.currentToolChange.next(this.lineService);
    }

    setRectangleService(): void {
        this.currentToolChange.next(this.rectangleService);
    }

    setEraserService(): void {
        this.currentToolChange.next(this.eraserService);
    }
}
