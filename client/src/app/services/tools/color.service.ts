import { Injectable } from '@angular/core';
import { faPalette } from '@fortawesome/free-solid-svg-icons';
import { Queue } from 'queue-typescript';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: string;
    secondaryColor: string;
    primaryOpacity: number;
    secondaryOpacity: number;
    // TODO opactity for each color
    tenLastUsedColors: Queue<string>;
    public icon = faPalette;

    constructor() {
        this.primaryColor = 'rgba(0,0,0,1)';
        this.secondaryColor = 'rgba(0,0,0,1)';
        this.primaryOpacity = 1;
        this.secondaryOpacity = 1;
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
        this.setPrimaryColorWithOpacity(this.primaryOpacity);
        this.setSecondaryColorWithOpacity(this.secondaryOpacity);
    }

    contains(color: string): boolean {
        let array = this.tenLastUsedColors.toArray();
        for (let i = 0; i < array.length; i++) {
            if (array[i] == color) {
                return true;
            }
        }
        return false;
    }
}
