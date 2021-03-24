import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
    // @Input() vertical: true;

    options: string[] = ['Nouveau dessin', 'Continuer un dessin', 'Ouvrir le caroussel de dessins'];

    drawingService: DrawingService;

    constructor(drawingService: DrawingService, public modal: MatDialog) {
        this.drawingService = drawingService;
    }

    isStarted(): boolean {
        return this.drawingService.drawingStarted;
    }

    openCarousel(): void {
        this.modal.open(CarrouselComponent);
    }
}
