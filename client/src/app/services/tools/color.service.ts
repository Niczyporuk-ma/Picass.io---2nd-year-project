import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: string;
    secondaryColor: string;
    // public primaryColor: number;
    // public secondaryColor: number;
    public opacity: number;
    //public opacitySecondary: number;
    //public color: number;

    constructor() {
        this.primaryColor = 'rgba(0,0,0,1)';
        this.secondaryColor = 'rgba(255,255,255,1)';
        this.opacity = 1;
    }

    setPrimaryColor(colorRB: string): void {
        this.primaryColor = colorRB;
        // TODO primaryColor =
        console.log('La couleur recue: ' + this.primaryColor);
    }

    setSecondaryColor(colorRB: string): void {
        this.secondaryColor = colorRB;
        console.log('La couleur secondaire recue: ' + this.secondaryColor);
    }

    //TODO concatenate color and opacity
    setPrimaryColorWithOpacity(opacity: number): void {
        const colors: string[] = this.primaryColor.split(',');
        this.primaryColor = colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + opacity + ')';
    }

    //TODO concatenate color and opacity
    setSecondaryColorWithOpacity(opacity: number): void {
        const colors: string[] = this.secondaryColor.split(',');
        this.secondaryColor = colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + opacity + ')';
    }

    swapPrimaryAndSecondary(): void {
        let temp: string;
        temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
    }
}
