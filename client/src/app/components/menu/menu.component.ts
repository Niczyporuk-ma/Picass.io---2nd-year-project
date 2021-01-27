import { Component, OnInit } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
    drawingService: DrawingService;

    constructor(drawingService: DrawingService) {
        this.drawingService = drawingService;
    }

    isStarted(): boolean {
        return this.drawingService.drawingStarted;
    }

    //@Input() vertical: true;

    ngOnInit(): void {}
}
