import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-carrousel',
    templateUrl: './carrousel.component.html',
    styleUrls: ['./carrousel.component.scss'],
})
export class CarrouselComponent implements OnInit {
    visible: boolean;

    ngOnInit(): void {
        this.visible = false;
    }

    toggleCarrousel(): void {
        this.visible = !this.visible;
    }
}
