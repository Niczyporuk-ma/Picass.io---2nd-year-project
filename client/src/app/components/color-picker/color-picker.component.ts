import { Component, OnInit } from '@angular/core';
import { MouseButton } from '@app/services/tools/pencil-service';
import { ColorService } from '../../services/tools/color.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
    public hue: string;
    public color: string = 'Choisissez une couleur!';
    public red: any = 'rouge';
    public green: any = 'vert';
    public blue: any = 'bleu';
    public colorService: ColorService;
    public opacity: number = 1;
    public primary: boolean = true;
    constructor(colorService: ColorService) {
        this.colorService = colorService;
    }

    changeOpacity(opacity: number): void {
        this.colorService.opacity = opacity;
        this.colorService.setPrimaryColorWithOpacity(opacity);
        this.colorService.setSecondaryColorWithOpacity(opacity);
    }
    splitColor(colorToSlplit: string): string[] {
        return colorToSlplit.replace('rgba(', '').split(',');
    }
    selectPrimaryColor(evt: MouseEvent) {
        if (evt.button === MouseButton.Left) {
            this.primary = true;
            this.color = this.colorService.primaryColor;
            //var copyColor = this.color;
            var splited = this.splitColor(this.color);
            this.red = splited[0];
            this.green = splited[1];
            this.blue = splited[2];
        }
    }
    selectSecondaryColor(evt: MouseEvent) {
        if (evt.button === MouseButton.Left) {
            this.primary = false;
            this.color = this.colorService.secondaryColor;
            var splited = this.splitColor(this.color);
            this.red = splited[0];
            this.green = splited[1];
            this.blue = splited[2];
        }
    }

    //TODO: 1. accepting the hashes codes for the colors. 2. Refactoring (lots of code just repeted)

    adjustRed(redIntensity: any) {
        this.green = this.splitColor(this.color)[1];
        this.blue = this.splitColor(this.color)[2];
        var opacity = this.splitColor(this.color)[3];
        this.color = 'rgba(' + redIntensity.target.value + ',' + this.green + ',' + this.blue + ',' + opacity;
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
        }
    }
    adjustGreen(greenIntensity: any) {
        this.red = this.splitColor(this.color)[0];
        this.blue = this.splitColor(this.color)[2];
        var opacity = this.splitColor(this.color)[3];
        this.color = 'rgba(' + this.red + ',' + greenIntensity.target.value + ',' + this.blue + ',' + opacity;
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
        }
    }
    adjustBlue(blueIntensity: any) {
        this.red = this.splitColor(this.color)[0];
        this.green = this.splitColor(this.color)[1];
        var opacity = this.splitColor(this.color)[3];
        this.color = 'rgba(' + this.red + ',' + this.green + ',' + blueIntensity.target.value + ',' + opacity;
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
        }
    }

    ngOnInit(): void {}
}
