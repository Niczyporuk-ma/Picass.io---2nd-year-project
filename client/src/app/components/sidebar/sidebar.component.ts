import { Component } from '@angular/core';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(private toolManger: ToolManagerService) {}


    changeColor(color: any): void {
        this.toolManger.getPencilService().changeColor(color.target.value);
    }

    changeWidth(width: any): void {
        this.toolManger.getPencilService().changeWidth(width.target.value);
    }
}
