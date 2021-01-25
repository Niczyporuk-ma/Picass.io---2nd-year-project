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
    test : Subject<Function> = new Subject<Function>();
    currentToolChange: Subject<Tool> = new Subject<Tool>();
    private currentTool: Tool;
    toolBoxShortcuts = new Map([
        // probleme avec les getShorcutValue()
        ['l', this.setLineService],
        ['r', this.setRectangleService],
        ['e', this.setEraserService],
        ['p', this.setPencilService],
    ]);

    tools: Tool[] = [this.pencilService,this.lineService,this.rectangleService,this.eraserService]

    constructor(
        private pencilService: PencilService,
        private lineService: LineServiceService,
        private rectangleService: RectangleService,
        private eraserService: EraserService,
    ) {
        
        this.currentTool = this.pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = value));
        //Faire un for pour initialiser la map
       
        // for (let tool of this.tools) {
        //     this.toolShortcuts.set(tool.shortcut.toString(), tool);
        // }
    }


    getCurrentTool (): Tool 
    {
        return this.currentTool;
    }

    getToolBoxShortcuts () :  Map<string, Function> {
        return this.toolBoxShortcuts;
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
        //this.currentTool = this.lineService;
        this.currentToolChange.next(this.lineService);
    }

    setRectangleService(): void {
        //this.currentTool = this.rectangleService;
        this.currentToolChange.next(this.rectangleService);
    }

    setEraserService(): void {
        //this.currentTool = this.eraserService;
        this.currentToolChange.next(this.eraserService);
    }
}
