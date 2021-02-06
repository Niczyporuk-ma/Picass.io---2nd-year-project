import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { LineServiceService } from '@app/services/tools/line-service.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { Subject } from 'rxjs';
import { ColorService } from './color.service';
import { EllipseService } from './ellipse.service';
import { EraserService } from './eraser.service';
import { RectangleService } from './rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    currentToolChange: Subject<Tool> = new Subject<Tool>();
    currentTool: Tool;
    // changer ca pour un autre conteneur
    tools: Tool[] = [this.pencilService, this.lineService, this.rectangleService, this.eraserService, this.ellipseService];
    toolBoxShortcuts: Map<string, Tool>;
    lineHistory: Vec2[][] = [];
    pencilHistory: Vec2[][] = [];
    rectangleHistory: Vec2[][] = [];

    constructor(
        public pencilService: PencilService,
        public lineService: LineServiceService,
        public rectangleService: RectangleService,
        public eraserService: EraserService,
        public ellipseService: EllipseService,
        public colorService: ColorService,
    ) {
        this.currentTool = this.pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = value));
        this.toolBoxShortcuts = new Map([
            [this.lineService.shortcut, this.tools[1]],
            [this.rectangleService.shortcut, this.tools[this.rectangleService.index]],
            [this.eraserService.shortcut, this.tools[this.eraserService.index]],
            [this.pencilService.shortcut, this.tools[this.pencilService.index]],
        ]);
    }

    // getters
    getPencilService(): PencilService {
        return this.pencilService;
    }

    // setters
    setTool(tool: Tool): void {
        this.currentToolChange.next(tool);
        this.currentTool.setColors(this.colorService);
    }

    // setPencilService(): void {
    //     this.currentToolChange.next(this.pencilService);
    // }

    // setLineService(): void {
    //     this.currentToolChange.next(this.lineService);
    // }

    // setRectangleService(): void {
    //     this.currentToolChange.next(this.rectangleService);
    // }

    // setEraserService(): void {
    //     this.currentToolChange.next(this.eraserService);
    // }

    // setEllipseService(): void {
    //     this.currentToolChange.next(this.ellipseService);
    // }
}
