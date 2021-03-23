// inspired by : https://malcoded.com/posts/angular-color-picker/

import { Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { ColorPaletteComponent } from '@app/components/color-picker/color-palette/color-palette.component';
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
    hexColor: string = '#FFF';
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
    private mouseDown: boolean = false;
    isRed: boolean = false;
    isGreen: boolean = false;
    isBlue: boolean = false;

    constructor(colorService: ColorService, public toolManager: ToolManagerService) {
        this.colorService = colorService;
        this.toolManager = toolManager;
    }

    @ViewChild(ColorPaletteComponent)
    colorPalette: ColorPaletteComponent;

    @Output()
    colorEmitted: EventEmitter<string> = new EventEmitter(true);

    changePrimaryOpacity(opacity: number): void {
        this.colorService.primaryOpacityPreview = opacity;
        this.colorService.setPrimaryColorWithOpacity(opacity);
    }

    changeSecondaryOpacity(opacity: number): void {
        this.colorService.secondaryOpacityPreview = opacity;
        this.colorService.setSecondaryColorWithOpacity(opacity);
    }

    splitColor(colorToSplit: string): string[] {
        return colorToSplit.replace('rgba(', '').replace(')', '').split(',');
    }

    selectPrimaryColor(evt: MouseEvent): void {
        if (evt.button === MouseButton.Left) {
            this.primary = true;
            this.color = this.colorService.primaryColor;
            const split: string[] = this.splitColor(this.color);
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

    adjustColor(colorIntensity: KeyboardEvent): void {
        let hexValue = '';
        if (!colorIntensity.ctrlKey) {
            hexValue += (colorIntensity.target as HTMLInputElement).value;
        }

        const regExp = new RegExp('^#[0-9A-Fa-f]{1,2}$');
        if (!regExp.test('#' + hexValue) && hexValue !== '') {
            alert('Entrez une valeur en hexadécimal!');
            hexValue = '';
        }

        const decimalValue = parseInt(hexValue, 16);

        this.red = this.splitColor(this.color)[this.redIndex];
        this.blue = this.splitColor(this.color)[this.blueIndex];
        this.green = this.splitColor(this.color)[this.greenIndex];
        const opacity = this.splitColor(this.color)[this.opacityIndex];

        if (this.isRed) {
            if (this.isNumber(decimalValue)) {
                this.color = 'rgba(' + decimalValue + ',' + this.green + ',' + this.blue + ',' + opacity + ')';
            }
        } else if (this.isGreen) {
            if (this.isNumber(decimalValue)) {
                this.color = 'rgba(' + this.red + ',' + decimalValue + ',' + this.blue + ',' + opacity + ')';
            }
        } else if (this.isBlue) {
            if (this.isNumber(decimalValue)) {
                this.color = 'rgba(' + this.red + ',' + this.green + ',' + decimalValue + ',' + opacity + ')';
            }
        }

        this.setColorPreview(this.primary);
        this.resetSelectedColors();
    }

    setColor(primary: boolean): void {
        if (primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.primaryOpacityPreview);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.secondaryOpacityPreview);
        }
    }

    setColorPreview(primary: boolean): void {
        if (primary) {
            this.colorService.primaryColorPreview = this.color;
        } else {
            this.colorService.secondaryColorPreview = this.color;
        }
    }

    rgbaToHex(colorInRgba: string): string {
        const rgbaValues: string[] = this.splitColor(colorInRgba);
        const red: number = +rgbaValues[0];
        const green: number = +rgbaValues[1];
        const blue: number = +rgbaValues[2];
        let opacity: number;
        const inPercent = 100;
        if (this.primary) {
            opacity = +(this.primOpacity * inPercent);
        } else {
            opacity = +(this.secOpacity * inPercent);
        }
        let redToString: string = red.toString(16);
        let greenToString: string = green.toString(16);
        let blueToString: string = blue.toString(16);
        const opacityToString: string = opacity.toString(16);

        if (redToString.length === 1) redToString = '0' + redToString;
        if (greenToString.length === 1) greenToString = '0' + greenToString;
        if (blueToString.length === 1) blueToString = '0' + blueToString;

        return '#' + redToString + greenToString + blueToString + opacityToString;
    }

    resetSelectedColors(): void {
        this.isRed = false;
        this.isGreen = false;
        this.isBlue = false;
    }

    isNumber(num: number): boolean {
        return !Number.isNaN(num);
    }

    disableShortcut(): void {
        this.toolManager.allowKeyPressEvents = false;
    }

    enableShortcut(): void {
        this.toolManager.allowKeyPressEvents = true;
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mouseDown = false;
    }

    onLeftClickPreviousColor(evt: MouseEvent, color: string): void {
        this.mouseDown = evt.button === MouseButton.Left;
        if (this.mouseDown === true) {
            this.colorService.primaryColorPreview = color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.primaryOpacityPreview);
            this.adjustQueueWhenSelectingPrevious(color);
            if (this.colorService.isConfirmed) {
                this.colorService.isConfirmed = false;
            }
        }
    }

    onRightClickPreviousColor(evt: MouseEvent, color: string): boolean {
        this.mouseDown = evt.button === MouseButton.Left;
        this.colorService.secondaryColorPreview = color;
        this.colorService.setSecondaryColorWithOpacity(this.colorService.secondaryOpacityPreview);
        this.adjustQueueWhenSelectingPrevious(color);
        if (this.colorService.isConfirmed) {
            this.colorService.isConfirmed = false;
        }
        return false;
    }

    emitColor(color: string): void {
        this.colorEmitted.emit(color);
    }

    adjustQueueWhenSelectingPrevious(color: string): void {
        const colorTemp: string = color;
        if (this.colorService.tenLastUsedColors.length > 1) {
            this.colorEmitted.emit(color);
            this.colorService.tenLastUsedColors.remove(color);
            this.colorService.tenLastUsedColors.append(colorTemp);
        }
        if (this.colorService.tenLastUsedColors.length > MAX_NUMBER_IN_LIST_OF_LAST_USED) {
            this.colorService.tenLastUsedColors.dequeue();
        }
    }
}
