import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
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
    widthValue: number = 1;
    blockEventListener: boolean = false;

    constructor(
        public pencilService: PencilService,
        public lineService: LineServiceService,
        public rectangleService: RectangleService,
        public eraserService: EraserService,
        public ellipseService: EllipseService,
        public colorService: ColorService,
        public drawingService: DrawingService,
    ) {
        this.currentTool = this.pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = value));
        this.toolBoxShortcuts = new Map([
            [this.lineService.shortcut, this.tools[this.lineService.index]],
            [this.rectangleService.shortcut, this.tools[this.rectangleService.index]],
            [this.eraserService.shortcut, this.tools[this.eraserService.index]],
            [this.pencilService.shortcut, this.tools[this.pencilService.index]],
        ]);
    }
    //A TESTER
    clearArrays(): void {
        if (this.drawingService.drawingStarted) {
            if (confirm('Voulez-vous commencer un nouveau dessin?\n Cette action effacera tout les dessins actuels')) {
                for (const tool of this.tools) {
                    tool.clearArrays();
                }
                this.drawingService.drawingStarted = false;
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            }
        }
    }

    waitForOPress(): void {
        if (!this.blockEventListener) {
            this.blockEventListener = true;
            window.addEventListener('keydown', (event: KeyboardEvent) => this.OPressHandler(event));
            window.addEventListener('keyup', (event: KeyboardEvent) => {
                if (event.key == 'Control') {
                    window.removeEventListener('keydown', (event: KeyboardEvent) => this.OPressHandler(event));
                    this.blockEventListener = false;
                }
            });
        }
    }

    OPressHandler(event: KeyboardEvent): void {
        if (event.key == 'o') {
            this.clearArrays();
            window.removeEventListener('keydown', (event: KeyboardEvent) => this.OPressHandler(event));
            event.preventDefault();
            //event.stopPropagation();
        }
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
}
