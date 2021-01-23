import { Injectable } from '@angular/core';
import { LineServiceService } from '@app/services/tools/line-service.service';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
    providedIn: 'root',
})
export class ToolManagerService {
    constructor(private pencilService: PencilService, private lineService: LineServiceService) {}

    getPencilService(): PencilService {
        return this.pencilService;
    }

    getLineService(): LineServiceService {
        return this.lineService;
    }
}
