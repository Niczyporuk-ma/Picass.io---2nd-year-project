import { Component } from '@angular/core';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    widthValue: number = this.toolManger.currentTool.styles.lineWidth;

    constructor(private toolManger: ToolManagerService) {}

    changeWidth(width: number): void {
        this.widthValue = this.toolManger.currentTool.styles.lineWidth;
        //if (this.toolManger.currentTool.isValid(width)) {
        this.toolManger.currentTool.changeWidth(width);
        //}
    }
}
