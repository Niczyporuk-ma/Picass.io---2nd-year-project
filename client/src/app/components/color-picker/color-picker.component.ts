import { Component, OnInit } from '@angular/core';
import { ColorService } from '../../services/tools/color.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
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

    ngOnInit(): void {}
}
