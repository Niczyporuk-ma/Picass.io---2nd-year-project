import { Injectable } from '@angular/core';
import { faPalette, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Queue } from 'queue-typescript';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: string;
    primaryColorPreview: string;
    secondaryColor: string;
    secondaryColorPreview: string;
    primaryOpacity: number;
    secondaryOpacity: number;
    tenLastUsedColors: Queue<string>;
    icon: IconDefinition = faPalette;
    isConfirmed: boolean = false;

    constructor() {
        this.primaryColor = 'rgba(0,0,0,1)';
        this.primaryColorPreview = 'rgba(0,0,0,1)';
        this.secondaryColor = 'rgba(0,0,0,1)';
        this.secondaryColorPreview = 'rgba(0,0,0,1)';
        this.primaryOpacity = 1;
        this.secondaryOpacity = 1;
        this.tenLastUsedColors = new Queue<string>();
    }

    // TODO concatenate color and opacity
    setPrimaryColorWithOpacity(opacity: number): void {
        const colors: string[] = this.primaryColor.split(',');
        this.primaryColor = colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + opacity + ')';
        this.primaryColorPreview = this.primaryColor;
    }

    // TODO concatenate color and opacity
    setSecondaryColorWithOpacity(opacity: number): void {
        const colors: string[] = this.secondaryColor.split(',');
        this.secondaryColor = colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + opacity + ')';
        this.secondaryColorPreview = this.secondaryColor;
    }

    swapPrimaryAndSecondary(): void {
        let temp: string;
        temp = this.primaryColor;

        let tempPreview: string;
        tempPreview = this.primaryColorPreview;

        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;

        this.primaryColorPreview = this.secondaryColorPreview;
        this.secondaryColorPreview = tempPreview;
        
        this.setPrimaryColorWithOpacity(this.primaryOpacity);
        this.setSecondaryColorWithOpacity(this.secondaryOpacity);
    }

    contains(color: string): boolean {
        const array = this.tenLastUsedColors.toArray();
        // for (let i = 0; i < array.length; i++) {
        //     if (array[i] == color) {
        //         return true;
        //     }
        // }
        for (const lastUsed of array) {
            if (lastUsed === color) {
                return true;
            }
        }

        return false;
    }
}
