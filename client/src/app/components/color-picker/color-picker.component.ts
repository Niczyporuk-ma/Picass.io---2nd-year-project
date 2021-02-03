import { Component } from '@angular/core';
import { ColorService } from '../../services/tools/color.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    public hue: string;
    public color: string;
    public colorService: ColorService;
    public opacity: number;
    constructor(colorService: ColorService) {
        this.colorService = colorService;
    }

    changeOpacity(opacity: number): void {
        this.colorService.opacity = opacity;
        this.colorService.setPrimaryColorWithOpacity(opacity);
        this.colorService.setSecondaryColorWithOpacity(opacity);
        console.log('opacity: ' + this.colorService.opacity);
        console.log('primary color after opacity: ' + this.colorService.primaryColor);
        console.log('secondary color after opacity: ' + this.colorService.secondaryColor);
    }
    splitColor(colorToSlplit: string): string[] {
        return colorToSlplit.split(',');
    }

    //TODO to refactor

    adjustRed(redIntensity: any) {
        var green = this.splitColor(this.color)[1];
        var blue = this.splitColor(this.color)[2];
        var opacity = this.splitColor(this.color)[3];
        this.color = 'rgba(' + redIntensity.target.value + ',' + green + ',' + blue + ',' + opacity;
        this.colorService.primaryColor = this.color;
        this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
    }
    adjustGreen(greenIntensity: any) {
        var red = this.splitColor(this.color)[0];
        var blue = this.splitColor(this.color)[2];
        var opacity = this.splitColor(this.color)[3];
        this.color = red + ',' + greenIntensity.target.value + ',' + blue + ',' + opacity;
        this.colorService.primaryColor = this.color;
        this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
    }
    adjustBlue(blueIntensity: any) {
        var red = this.splitColor(this.color)[0];
        var green = this.splitColor(this.color)[1];
        var opacity = this.splitColor(this.color)[3];
        this.color = red + ',' + green + ',' + blueIntensity.target.value + ',' + opacity;
        this.colorService.primaryColor = this.color;
        this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
    }

    ngOnInit(): void {}
}
