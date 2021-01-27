import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    public primaryColor: number;
    public secondaryColor: number;
    public opacityPrimary: number;
    public opacitySecondary: number;
    public color: number;

    //TODO concatenate color and opacity
    setPrimaryColorWithOpacity(): void {
        //this.primaryColor = concat(this.color, this.opacityPrimary);
    }

    //TODO concatenate color and opacity
    setSecondaryColorWithOpacity(color: number, opacity: number) {
        //this.secondaryColor = concat(color, opacity);
    }

    swapPrimaryAndSecondary(): void {
        let temp: number;
        temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
    }

    constructor() {}
}
