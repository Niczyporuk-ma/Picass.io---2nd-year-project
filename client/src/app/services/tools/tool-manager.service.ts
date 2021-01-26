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
    currentToolChange: Subject<Tool> = new Subject<Tool>();
    private currentTool: Tool;
    //changer ca pour un autre conteneur
    private tools: Tool[] = [this.pencilService, this.lineService, this.rectangleService, this.eraserService];
    private toolBoxShortcuts: Map<string, Tool>;

    constructor(
        private pencilService: PencilService,
        private lineService: LineServiceService,
        private rectangleService: RectangleService,
        private eraserService: EraserService,
    ) {
        this.currentTool = this.pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = value));
        this.toolBoxShortcuts = new Map([
            [this.lineService.getShorcutValue(), this.tools[1]],
            [this.rectangleService.getShorcutValue(), this.tools[2]],
            [this.eraserService.getShorcutValue(), this.tools[3]],
            [this.pencilService.getShorcutValue(), this.tools[0]],
        ]);
    }

    //getters
    public getToolBox(): Tool[] {
        return this.tools;
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

    //setters
    setTool(tool: Tool) {
        this.currentToolChange.next(tool);
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
