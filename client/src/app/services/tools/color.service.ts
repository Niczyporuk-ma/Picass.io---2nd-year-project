import { Injectable } from '@angular/core';
import { Queue } from 'queue-typescript';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: string;
    secondaryColor: string;
    opacity: number;
    // TODO opactity for each color
    tenLastUsedColors: Queue<string>;

    constructor() {
        this.primaryColor = 'rgba(0,0,0,1)';
        this.secondaryColor = 'rgba(0,0,0,1)';
        this.opacity = 1;
        this.tenLastUsedColors = new Queue<string>();
    }

    // TODO concatenate color and opacity
    setPrimaryColorWithOpacity(opacity: number): void {
        const colors: string[] = this.primaryColor.split(',');
        this.primaryColor = colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + opacity + ')';
    }

    // TODO concatenate color and opacity
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

    contains(color: string): boolean {
        let array = this.tenLastUsedColors.toArray();
        for(let i = 0; i < array.length; i++){
            if(array[i] == color){
                return true;
            }
        }
        return false;
    }


    // TODO : faire les 10 derniers couleurs (le bouffer)
}
