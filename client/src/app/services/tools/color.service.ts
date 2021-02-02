import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    public primaryColor: string;
    public secondaryColor: string;
    // public primaryColor: number;
    // public secondaryColor: number;
    public opacity: number;
    //public opacitySecondary: number;
    //public color: number;

    constructor() {
        this.primaryColor = 'black';
        this.secondaryColor = 'black';
        this.opacity = 1;
    }

    setPrimaryColor(colorRB: string) {
        this.primaryColor = colorRB;
        //TODO primaryColor =
        console.log('La couleur recue: ' + this.primaryColor);
    }

    setSecondaryColor(colorRB: string) {
        this.secondaryColor = colorRB;
        console.log('La couleur secondaire recue: ' + this.secondaryColor);
    }

    //TODO concatenate color and opacity
    setPrimaryColorWithOpacity(opacity: number): void {
        const colors: string[] = this.primaryColor.split(',');
        this.primaryColor = colors[0] + colors[1] + colors[2] + opacity + ')';
    }

    //TODO concatenate color and opacity
    setSecondaryColorWithOpacity(color: number, opacity: number) {
        //this.secondaryColor = concat(color, opacity);
    }

    swapPrimaryAndSecondary(): void {
        let temp: string;
        temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
    }
}
