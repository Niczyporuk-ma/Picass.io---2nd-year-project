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
    currentCommand : Function;
    toolBoxShortcuts : Map<string,Function>;
    

    tools: Tool[] = [this.pencilService,this.lineService,this.rectangleService,this.eraserService]

    constructor(
        private pencilService: PencilService,
        private lineService: LineServiceService,
        private rectangleService: RectangleService,
        private eraserService: EraserService,
    ) {
        
        this.currentTool = this.pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = value));
        
        this.toolBoxShortcuts = new Map([
            [this.lineService.getShorcutValue(), this.setLineService],
            [this.rectangleService.getShorcutValue(), this.setRectangleService],
            [this.eraserService.getShorcutValue(), this.setEraserService],
            [this.pencilService.getShorcutValue(), this.setPencilService],
        ]);
    }

    onKeyPress(key: string): void {
        if (this.currentTool.getLocalShorcuts().has(key)) {
            this.currentCommand = <Function>this.currentTool.getLocalShorcuts().get(key);
            this.currentCommand();

        } else {
            if (this.toolBoxShortcuts.has(key)) {
                this.currentCommand = <Function>this.toolBoxShortcuts.get(key);
                this.currentCommand();
            }  
        }
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
        this.currentToolChange.next(this.lineService);
    }

    setRectangleService(): void {
        this.currentToolChange.next(this.rectangleService);
    }

    setEraserService(): void {
        this.currentToolChange.next(this.eraserService);
    }
}
