import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AirbrushService } from '@app/services/tools/airbrush.service';
import { EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';
import { LineServiceService } from '@app/services/tools/line-service.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';
import { Subject } from 'rxjs';
import { ColorService } from './color.service';
import { EllipseService } from './ellipse.service';
import { EraserService } from './eraser.service';
import { PipetteService } from './pipette.service';
import { PolygonService } from './polygon.service';
import { RectangleService } from './rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    currentToolChange: Subject<Tool> = new Subject<Tool>();
    currentTool: Tool;
    tools: Tool[] = [
        this.pencilService,
        this.lineService,
        this.rectangleService,
        this.eraserService,
        this.ellipseService,
        this.airbrushService,
        this.polygonService,
        this.rectangleSelection,
        this.ellipseSelection,
        this.pipetteService,
    ];
    toolBoxShortcuts: Map<string, Tool>;
    lineHistory: Vec2[][] = [];
    pencilHistory: Vec2[][] = [];
    rectangleHistory: Vec2[][] = [];
    widthValue: number = 1;
    blockEventListener: boolean = false;
    allowKeyPressEvents: boolean = true;
    showPalette: boolean = false;
    showSaveMenu: boolean = false;

    constructor(
        public pencilService: PencilService,
        public lineService: LineServiceService,
        public rectangleService: RectangleService,
        public eraserService: EraserService,
        public ellipseService: EllipseService,
        public colorService: ColorService,
        public drawingService: DrawingService,
        public pipetteService: PipetteService,
        public airbrushService: AirbrushService,
        public polygonService: PolygonService,
        public rectangleSelection: RectangleSelectionService,
        public ellipseSelection: EllipseSelectionService,
    ) {
        this.currentTool = this.pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = value));
        this.toolBoxShortcuts = new Map([
            [this.lineService.shortcut, this.tools[this.lineService.index]],
            [this.rectangleService.shortcut, this.tools[this.rectangleService.index]],
            [this.eraserService.shortcut, this.tools[this.eraserService.index]],
            [this.pencilService.shortcut, this.tools[this.pencilService.index]],
            [this.ellipseService.shortcut, this.tools[this.ellipseService.index]],
            [this.pipetteService.shortcut, this.tools[this.pipetteService.index]],
            [this.airbrushService.shortcut, this.tools[this.airbrushService.index]],
            [this.polygonService.shortcut, this.tools[this.polygonService.index]],
            [this.rectangleSelection.shortcut, this.tools[this.rectangleSelection.index]],
            [this.ellipseSelection.shortcut, this.tools[this.ellipseSelection.index]],
        ]);
    }

    clearArrays(): void {
        if (this.drawingService.drawingStarted) {
            if (confirm('Cette action effacera votre dessin actuel!\n Assurez-vous de le sauvegarder si vous voulez le conserver.')) {
                for (const tool of this.tools) {
                    tool.clearArrays();
                }
                this.drawingService.drawingStarted = false;
                this.drawingService.clearCanvas(this.drawingService.baseCtx);
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            }
        }
    }

    setTool(tool: Tool): void {
        this.currentToolChange.next(tool);
        this.currentTool.setColors(this.colorService);
    }
}
