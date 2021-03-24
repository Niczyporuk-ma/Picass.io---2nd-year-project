import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { IndexService } from '@app/services/index/index.service';
import { Drawing } from '@common/drawing.interface';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    shortcuts: ShortcutInput[] = [];

    constructor(private basicService: IndexService, public modal: MatDialog) {
        // source de la librairie utilisee: https://www.npmjs.com/package/ng-keyboard-shortcuts
        this.shortcuts.push({
            key: 'ctrl + g',
            preventDefault: true,
            command: () => this.openCarousel(),
        });
    }

    openCarousel(): void {
        this.modal.open(CarrouselComponent);
    }

    sendTimeToServer(drawing: Drawing): void {
        // const newTimeMessage: Message = {
        //     title: 'Hello from the client',
        //     body: 'Time is : ' + new Date().toString(),
        // };

        // Important de ne pas oublier "subscribe" ou l'appel ne sera jamais lancé puisque personne l'observe
        // this.basicService.basicPost(newTimeMessage).subscribe();
        this.basicService.basicPost(drawing).subscribe();
    }

    /*deleteElement(): void {
        this.basicService.basicDelete().subscribe();
    }*/

    // modifyElement(): void {
    //     const drawing: Drawing = {
    //         name: 'test',
    //         tags: ['test1', 'test2'],
    //     };

    //     this.basicService.basicPatch(drawing).subscribe();
    // }

    // getDrawingsFromServer(): void {
    //     this.basicService.basicGet();
    //     // Cette étape transforme le Message en un seul string
    //     // .pipe(
    //     //     map((message: Drawing) => {
    //     //         return `${message.name} ${message.tags}`;
    //     //     }),
    //     // )
    //     // .subscribe(this.message);
    // }
}
