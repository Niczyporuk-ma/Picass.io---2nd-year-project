import { Component } from '@angular/core';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    widthValue: number = 25;

    constructor(private toolManger: ToolManagerService) {}

    changeWidth(width: number): void {
        this.toolManger.currentTool.changeWidth(width);
        this.widthValue = this.toolManger.currentTool.styles.lineWidth;
    }
}
