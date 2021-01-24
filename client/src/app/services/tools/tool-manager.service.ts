import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { LineServiceService } from '@app/services/tools/line-service.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { Subject } from 'rxjs';
import { RectangleService } from './rectangle.service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    line: LineServiceService;
    pencil: PencilService;
    rectangle: RectangleService;
    currentToolChange: Subject<Tool> = new Subject<Tool>();
    currentTool: Tool = this.rectangleService;

    tools: Tool[] = [this.pencilService, this.lineService, this.rectangleService];

    constructor(private pencilService: PencilService, private lineService: LineServiceService, private rectangleService: RectangleService) {
        this.rectangle = rectangleService;
        this.line = lineService;
        this.pencil = pencilService;
        this.currentTool = pencilService;
        this.currentToolChange.subscribe((value) => (this.currentTool = this.pencil));
    }

    getPencilService(): PencilService {
        return this.pencilService;
    }

    getLineService(): LineServiceService {
        return this.lineService;
    }

    setPencilService(): void {
        this.currentTool = this.pencil;
        this.currentToolChange.next(this.currentTool);
    }

    setLineService(): void {
        this.currentTool = this.line;
        this.currentToolChange.next(this.currentTool);
    }

    setRectangleService(): void {
        this.currentTool = this.rectangle;
        this.currentToolChange.next(this.currentTool);
    }
}
