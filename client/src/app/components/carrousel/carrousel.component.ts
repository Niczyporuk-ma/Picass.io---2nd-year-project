import { Component, OnInit } from '@angular/core';
import { FilterService } from '@app/services/index/filter.service';
import { IndexService } from '@app/services/index/index.service';
import { Drawing } from '@common/drawing.interface';

@Component({
    selector: 'app-carrousel',
    templateUrl: './carrousel.component.html',
    styleUrls: ['./carrousel.component.scss'],
})
export class CarrouselComponent implements OnInit {
    visible: boolean;
    filterService: FilterService;
    data: Drawing[];
    dataToKeep: Drawing[];
    dataFiltered: Drawing[] = [];
    isPossibleToDelete: boolean = false;
    isErrorRemoving: boolean = false;
    isErrorGetting: boolean = false;

    constructor(filterService: FilterService, private indexService: IndexService) {
        this.filterService = filterService;
    }

    ngOnInit(): void {
        this.visible = false;
    }

    toggleCarrousel(): void {
        this.visible = !this.visible;
        this.isErrorRemoving = false;
        this.isErrorGetting = false;
        this.isPossibleToDelete = false;
    }

    updateDataFiltered(): void {
        for (let i = 0; i < this.dataFiltered.length; i++) {
            if (this.dataFiltered[i]._id.toString() === this.filterService.id) {
                this.dataFiltered.splice(i, 1);
            }
        }
    }

    getDrawings(): void {
        this.indexService.basicGet().subscribe((drawings: Drawing[]) => {
            this.data = drawings;
            this.filterDrawings();
        });
    }

    filterDrawings(): void {
        this.filterService.filteringToGet(this.data, this.dataFiltered);
        if (this.dataFiltered.length === 0) {
            this.isErrorGetting = true;
        } else {
            this.isPossibleToDelete = true;
        }
    }

    deleteDrawings(): void {
        this.indexService.basicDelete(this.filterService.id).subscribe();
    }
}
