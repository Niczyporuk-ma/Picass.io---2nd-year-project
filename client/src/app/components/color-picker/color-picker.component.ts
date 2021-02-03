// inspired by : https://malcoded.com/posts/angular-color-picker/

import { Component } from '@angular/core';
import { ColorService } from '@app/services/tools/color.service';
import { MouseButton } from '@app/services/tools/pencil-service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    hue: string;
    color: string = 'Choisissez une couleur!';
    red: string = '';
    green: string = '';
    blue: string = '';
    colorService: ColorService;
    opacity: number = 1;
    primary: boolean = true;
    redIndex: number = 0;
    greenIndex: number = 1;
    blueIndex: number = 2;
    opacityIndex: number = 3;

    constructor(colorService: ColorService) {
        this.colorService = colorService;
    }

    // TODO: Adjust when palette is clicked undefined behaviour
    changeOpacity(opacity: number): void {
        this.colorService.opacity = opacity;
        this.colorService.setPrimaryColorWithOpacity(opacity);
        this.colorService.setSecondaryColorWithOpacity(opacity);
    }

    splitColor(colorToSlplit: string): string[] {
        return colorToSlplit.replace('rgba(', '').split(',');
    }

    selectPrimaryColor(evt: MouseEvent): void {
        if (evt.button === MouseButton.Left) {
            this.primary = true;
            this.color = this.colorService.primaryColor;
            // var copyColor = this.color;
            const split: string[] = this.splitColor(this.color); // const split = this.splitColor(this.color);
            this.red = split[this.redIndex];
            this.green = split[this.greenIndex];
            this.blue = split[this.blueIndex];
        }
    }

    selectSecondaryColor(evt: MouseEvent): void {
        if (evt.button === MouseButton.Left) {
            this.primary = false;
            this.color = this.colorService.secondaryColor;
            const split = this.splitColor(this.color);
            this.red = split[this.redIndex];
            this.green = split[this.greenIndex];
            this.blue = split[this.blueIndex];
        }
    }

    // TODO: 1. accepting the hashes codes for the colors. 2. Refactoring (lots of code just repeted)
    adjustRed(redIntensity: KeyboardEvent): void {
        let value = '';
        value += (redIntensity.target as HTMLInputElement).value;
        this.green = this.splitColor(this.color)[this.greenIndex];
        this.blue = this.splitColor(this.color)[this.blueIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];
        this.color = 'rgba(' + value + ',' + this.green + ',' + this.blue + ',' + opacity;
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
        }
    }

    adjustGreen(greenIntensity: KeyboardEvent): void {
        // change the any type
        let value = '';
        value += (greenIntensity.target as HTMLInputElement).value;
        this.red = this.splitColor(this.color)[this.redIndex];
        this.blue = this.splitColor(this.color)[this.blueIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];
        this.color = 'rgba(' + this.red + ',' + value + ',' + this.blue + ',' + opacity;
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
        }
    }

    adjustBlue(blueIntensity: KeyboardEvent): void {
        // change any type
        let value = '';
        value += (blueIntensity.target as HTMLInputElement).value;
        this.red = this.splitColor(this.color)[this.redIndex];
        this.green = this.splitColor(this.color)[this.greenIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];
        this.color = 'rgba(' + this.red + ',' + this.green + ',' + value + ',' + opacity;
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
        }
    }
}
