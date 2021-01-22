import { Component, OnInit } from '@angular/core';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit  {
    constructor(private pencilService : PencilService) { }

    ngOnInit(){}


    changeColor(color:any){
        this.pencilService.changeColor(color.target.value);
    }

    changeWidth (width : any) 
    {
        this.pencilService.changeWidth(width.target.value);
    }
}
