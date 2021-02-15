// inspired by : https://malcoded.com/posts/angular-color-picker/

import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MouseButton } from '@app/enums/enums';
import { ColorService } from '@app/services/tools/color.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
const MAX_NUMBER_IN_LIST_OF_LAST_USED = 10;

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    hue: string;
    color: string = 'rgba(0,0,0,1)';
    red: string = '';
    green: string = '';
    blue: string = '';
    colorService: ColorService;
    primOpacity: number = 1;
    secOpacity: number = 1;
    primary: boolean = true;
    redIndex: number = 0;
    greenIndex: number = 1;
    blueIndex: number = 2;
    opacityIndex: number = 3;
    private mousedown: boolean = false;
    private contextmenu: boolean = false;

    constructor(colorService: ColorService, public toolManager: ToolManagerService) {
        this.colorService = colorService;
        this.toolManager = toolManager;
    }

    @Output()
    colorEmitted: EventEmitter<string> = new EventEmitter(true);

    // TODO: Adjust when palette is clicked undefined behaviour
    // NOTE: TEST METHODS: changePrimary/secondary, and methods affected by splitting opacity in 2 variables (primOpacity/secOpacity)

    changePrimaryOpacity(opacity: number): void {
        this.colorService.primaryOpacity = opacity;
        this.colorService.setPrimaryColorWithOpacity(opacity);
    }

    changeSecondaryOpacity(opacity: number): void {
        this.colorService.secondaryOpacity = opacity;
        this.colorService.setSecondaryColorWithOpacity(opacity);
    }

    splitColor(colorToSplit: string): string[] {
        return colorToSplit.replace('rgba(', '').replace(')', '').split(',');
    }

    selectPrimaryColor(evt: MouseEvent): void {
        if (evt.button === MouseButton.Left) {
            this.primary = true;
            this.color = this.colorService.primaryColor;
            // var copyColor = this.color;
            const split: string[] = this.splitColor(this.color);
            console.log(this.splitColor(this.color));
            // const split = this.splitColor(this.color);
            this.red = split[this.redIndex];
            this.green = split[this.greenIndex];
            this.blue = split[this.blueIndex];
            this.primOpacity = +split[this.opacityIndex];
        }
    }

    selectSecondaryColor(evt: MouseEvent): void {
        if (evt.button === MouseButton.Left) {
            this.primary = false;
            this.color = this.colorService.secondaryColor;
            const split = this.splitColor(this.color);
            this.red = split[this.redIndex];
            this.green = split[this.greenIndex];
            this.blue = split[this.blueIndex];
            this.secOpacity = +split[this.opacityIndex];
        }
    }

    // TODO: 1. accepting the hashes codes for the colors. 2. Refactoring (lots of code just repeted)
    adjustRed(redIntensity: KeyboardEvent): void {
        let value = '';
        value += (redIntensity.target as HTMLInputElement).value;
        this.green = this.splitColor(this.color)[this.greenIndex];
        this.blue = this.splitColor(this.color)[this.blueIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];
        this.color = 'rgba(' + value + ',' + this.green + ',' + this.blue + ',' + opacity + ')';
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.primaryOpacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.secondaryOpacity);
        }
    }

    adjustGreen(greenIntensity: KeyboardEvent): void {
        // change the any type
        let value = '';
        value += (greenIntensity.target as HTMLInputElement).value;
        this.red = this.splitColor(this.color)[this.redIndex];
        this.blue = this.splitColor(this.color)[this.blueIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];
        this.color = 'rgba(' + this.red + ',' + value + ',' + this.blue + ',' + opacity + ')';
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.primaryOpacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.secondaryOpacity);
        }
    }

    adjustBlue(blueIntensity: KeyboardEvent): void {
        let value = '';
        value += (blueIntensity.target as HTMLInputElement).value;
        this.red = this.splitColor(this.color)[this.redIndex];
        this.green = this.splitColor(this.color)[this.greenIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];
        this.color = 'rgba(' + this.red + ',' + this.green + ',' + value + ',' + opacity + ')';
        if (this.primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.primaryOpacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.secondaryOpacity);
        }
    }

    disableShortcut(): void {
        this.toolManager.allowKeyPressEvents = false;
    }

    enableShortcut(): void {
        this.toolManager.allowKeyPressEvents = true;
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    onLeftClick(evt: MouseEvent, color: string): void {
        this.mousedown = evt.button === MouseButton.Left;
        this.contextmenu = false;
        let colorTemp: string = color;
        if (this.contextmenu === false && this.mousedown === true) {
            if (this.colorService.tenLastUsedColors.length > 1) {
                this.colorEmitted.emit(color);
                this.colorService.tenLastUsedColors.remove(color);
                this.colorService.tenLastUsedColors.append(colorTemp);
            }
            if (this.colorService.tenLastUsedColors.length > MAX_NUMBER_IN_LIST_OF_LAST_USED) {
                this.colorService.tenLastUsedColors.dequeue();
            }
            this.colorService.primaryColor = color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.primaryOpacity);
        }
    }

    onRightClickDown(evt: MouseEvent, color: string): boolean {
        this.mousedown = evt.button === MouseButton.Left;
        this.contextmenu = true;
        let colorTemp: string = color;
        if (this.colorService.tenLastUsedColors.length > 1) {
            this.colorEmitted.emit(color);
            this.colorService.tenLastUsedColors.remove(color);
            this.colorService.tenLastUsedColors.append(colorTemp);
        }
        if (this.colorService.tenLastUsedColors.length > MAX_NUMBER_IN_LIST_OF_LAST_USED) {
            this.colorService.tenLastUsedColors.dequeue();
        }
        this.colorService.secondaryColor = color;
        this.colorService.setSecondaryColorWithOpacity(this.colorService.secondaryOpacity);
        return false;
    }

    emitColor(color: string): void {
        this.colorEmitted.emit(color);
    }
}
