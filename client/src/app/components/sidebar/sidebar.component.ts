import { Component, OnInit } from '@angular/core';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit  {
    constructor(private toolManger : ToolManagerService) { }

    ngOnInit(){}


    changeColor(color:any){
        this.toolManger.getPencilService().changeColor(color.target.value);
    }

    changeWidth (width : any) 
    {
        this.toolManger.getPencilService().changeWidth(width.target.value);
    }
}
