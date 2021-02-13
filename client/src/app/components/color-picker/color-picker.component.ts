// inspired by : https://malcoded.com/posts/angular-color-picker/

import { Component } from '@angular/core';
import { ColorService } from '@app/services/tools/color.service';
import { MouseButton } from '@app/services/tools/pencil-service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    hue: string;
    color: string = 'rgba(0,0,0,1)';
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

    constructor(colorService: ColorService, public toolManager: ToolManagerService) {
        this.colorService = colorService;
        this.toolManager = toolManager;
    }

    // TODO: Adjust when palette is clicked undefined behaviour
    // TODO : opacite pour les 2 couleurs (separement)
    changeOpacity(opacity: number): void {
        this.colorService.opacity = opacity;
        if (this.primary) {
            this.colorService.setPrimaryColorWithOpacity(opacity);
        } else{
            this.colorService.setSecondaryColorWithOpacity(opacity);
        }
    }

    splitColor(colorToSplit: string): string[] {
        return colorToSplit.replace('rgba(', '').replace(')', '').split(',');
    }

    selectPrimaryColor(evt: MouseEvent): void {
        if (evt.button === MouseButton.Left) {
            this.primary = true;
            this.color = this.colorService.primaryColor;
            // var copyColor = this.color;
            const split: string[] = this.splitColor(this.color); 
            console.log( this.splitColor(this.color));
            // const split = this.splitColor(this.color);
            this.red = split[this.redIndex];
            this.green = split[this.greenIndex];
            this.blue = split[this.blueIndex];
            this.opacity = +split[this.opacityIndex];
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
            this.opacity = +split[this.opacityIndex];
        }
    }

    // TODO: 1. accepting the hashes codes for the colors. 2. Refactoring (lots of code just repeted)
    adjustRed(redIntensity: KeyboardEvent): void {
        let value = '';
        value += (redIntensity.target as HTMLInputElement).value;
        this.green = this.splitColor(this.color)[this.greenIndex];
        this.blue = this.splitColor(this.color)[this.blueIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];
        this.color = 'rgba(' + value + ',' + this.green + ',' + this.blue + ',' + opacity + ')';
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
        }
        console.log()
    }

    adjustGreen(greenIntensity: KeyboardEvent): void {
        // change the any type
        let value = '';
        value += (greenIntensity.target as HTMLInputElement).value;
        this.red = this.splitColor(this.color)[this.redIndex];
        this.blue = this.splitColor(this.color)[this.blueIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];
        this.color = 'rgba(' + this.red + ',' + value + ',' + this.blue + ',' + opacity + ')';
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
        }
    }

    adjustBlue(blueIntensity: KeyboardEvent): void {
        let value = '';
        value += (blueIntensity.target as HTMLInputElement).value;
        this.red = this.splitColor(this.color)[this.redIndex];
        this.green = this.splitColor(this.color)[this.greenIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];
        this.color = 'rgba(' + this.red + ',' + this.green + ',' + value + ',' + opacity + ')';
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
        }
    }

    
    
    disableShortcut(): void {
        this.toolManager.allowKeyPressEvents = false;
    }

    enableShortcut(): void {
        this.toolManager.allowKeyPressEvents = true;

    }
}

