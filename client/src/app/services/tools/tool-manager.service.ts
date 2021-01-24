import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { LineServiceService } from '@app/services/tools/line-service.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    line: LineServiceService;
    pencil: PencilService;
    currentToolChange: Subject<Tool> = new Subject<Tool>();
    currentTool: Tool = this.pencilService;

    tools: Tool[] = [this.pencilService, this.lineService];

    constructor(private pencilService: PencilService, private lineService: LineServiceService) {
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
}
