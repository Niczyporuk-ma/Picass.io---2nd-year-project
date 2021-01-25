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
    eraser: EraserService;
    line: LineServiceService;
    pencil: PencilService;
    rectangle: RectangleService;
    currentToolChange: Subject<Tool> = new Subject<Tool>();
    currentTool: Tool;
    a: Function;
    toolShortcuts: Map<string, Function> = new Map([
        ['l', this.setLineService],
        ['r', this.setRectangleService],
        ['e', this.setEraserService],
        ['p', this.setPencilService],
    ]);

    tools: Tool[] = [this.pencilService, this.lineService, this.rectangleService, this.eraserService];

    constructor(
        private pencilService: PencilService,
        private lineService: LineServiceService,
        private rectangleService: RectangleService,
        private eraserService: EraserService,
    ) {
        this.eraser = eraserService;
        this.rectangle = rectangleService;
        this.line = lineService;
        this.pencil = pencilService;
        this.currentTool = this.pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = value));
        // for (let tool of this.tools) {
        //     this.toolShortcuts.set(tool.shortcut.toString(), tool);
        // }
    }

    onKeyPress(key: string): void {
        if (this.currentTool.localShortcut.has(key)) {
            this.a = <Function>this.currentTool.localShortcut.get(key);
            this.a();
        } else {
            if (this.toolShortcuts.has(key)) {
                this.a = <Function>this.toolShortcuts.get(key);
                this.a();
                console.log(this.currentTool);
            }
            // else {
            //     alert("Commande n'existe pas pour cet outil");
            // }
        }
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
