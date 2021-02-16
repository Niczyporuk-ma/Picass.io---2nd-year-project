import { Injectable } from '@angular/core';
import { faPalette, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Queue } from 'queue-typescript';
const MAX_NUMBER_IN_LIST_OF_LAST_USED = 10;

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
    primaryOpacityPreview: number;
    secondaryOpacityPreview: number;
    tenLastUsedColors: Queue<string>;
    icon: IconDefinition = faPalette;
    isConfirmed: boolean = false;
    showConfirmButton = false;

    constructor() {
        this.primaryColor = 'rgba(0,0,0,1)';
        this.primaryColorPreview = 'rgba(0,0,0,1)';
        this.secondaryColor = 'rgba(0,0,0,1)';
        this.secondaryColorPreview = 'rgba(0,0,0,1)';
        this.primaryOpacity = 1;
        this.secondaryOpacity = 1;
        this.primaryOpacityPreview = 1;
        this.secondaryOpacityPreview = 1;
        this.tenLastUsedColors = new Queue<string>();
    }

    // TODO concatenate color and opacity
    setPrimaryColorWithOpacity(opacity: number): void {
        const colors: string[] = this.primaryColorPreview.split(',');
        this.primaryColorPreview = colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + opacity + ')';
    }

    // TODO concatenate color and opacity
    setSecondaryColorWithOpacity(opacity: number): void {
        const colors: string[] = this.secondaryColorPreview.split(',');
        this.secondaryColorPreview = colors[0] + ',' + colors[1] + ',' + colors[2] + ',' + opacity + ')';
    }

    swapPrimaryAndSecondary(): void {
        let tempPreview: string;
        tempPreview = this.primaryColorPreview;

        this.primaryColorPreview = this.secondaryColorPreview;
        this.secondaryColorPreview = tempPreview;

        this.setPrimaryColorWithOpacity(this.primaryOpacityPreview);
        this.setSecondaryColorWithOpacity(this.secondaryOpacityPreview);
    }

    contains(color: string): boolean {
        const array = this.tenLastUsedColors.toArray();
        for (const lastUsed of array) {
            if (lastUsed === color) {
                return true;
            }
        }

        return false;
    }

    resetValuesOnCancel(): void {
        this.primaryColorPreview = this.primaryColor;
        this.secondaryColorPreview = this.secondaryColor;
        this.primaryOpacityPreview = this.primaryOpacity;
        this.secondaryOpacityPreview = this.secondaryOpacity;
    }

    setValuesOnConfirm(): void {
        if (this.primaryColorPreview != this.primaryColor) {
            this.pushToQueueOnConfirm(this.primaryColorPreview);
        }
        if (this.secondaryColorPreview != this.secondaryColor) {
            this.pushToQueueOnConfirm(this.secondaryColorPreview);
        }
        this.primaryColor = this.primaryColorPreview;
        this.secondaryColor = this.secondaryColorPreview;
        this.primaryOpacity = this.primaryOpacityPreview;
        this.secondaryOpacity = this.secondaryOpacityPreview;
    }

    pushToQueueOnConfirm(color: string): void {
        if (!this.contains(color)) {
            this.tenLastUsedColors.append(color);
            if (this.tenLastUsedColors.length > MAX_NUMBER_IN_LIST_OF_LAST_USED) {
                this.tenLastUsedColors.dequeue();
            }
        } else {
            this.tenLastUsedColors.remove(color);
            this.tenLastUsedColors.append(color);
            if (this.tenLastUsedColors.length > MAX_NUMBER_IN_LIST_OF_LAST_USED) {
                this.tenLastUsedColors.dequeue();
            }
        }
    }
}
