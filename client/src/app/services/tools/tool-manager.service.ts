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
    currentTool: Tool;
    //changer ca pour un autre conteneur
    tools: Tool[] = [this.pencilService, this.lineService, this.rectangleService, this.eraserService];
    toolBoxShortcuts: Map<string, Tool> ;

    constructor(
        private pencilService: PencilService,
        private lineService: LineServiceService,
        private rectangleService: RectangleService,
        private eraserService: EraserService,
    ) {
        this.currentTool = this.pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = value));
        this.toolBoxShortcuts = new Map([
            [this.lineService.shortcut, this.tools[1]],
            [this.rectangleService.shortcut, this.tools[2]],
            [this.eraserService.shortcut, this.tools[3]],
            [this.pencilService.shortcut, this.tools[0]],
        ]);
    }

    //getters
   getPencilService() : PencilService {
       return this.pencilService;
   }

    //setters
    setTool(tool: Tool) { this.currentToolChange.next(tool);}

    setPencilService(): void {this.currentToolChange.next(this.pencilService); }

    setLineService(): void {this.currentToolChange.next(this.lineService);}

    setRectangleService(): void {this.currentToolChange.next(this.rectangleService);}

    setEraserService(): void {this.currentToolChange.next(this.eraserService);}
}
