// inspired by : https://malcoded.com/posts/angular-color-picker/

import { Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { MouseButton } from '@app/enums/enums';
import { ColorService } from '@app/services/tools/color.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
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
    private mousedown: boolean = false;
    private contextmenu: boolean = false;
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

    adjustColor(colorIntensity: KeyboardEvent) {
        let hexValue = '';
        if (!colorIntensity.ctrlKey) {
            hexValue += (colorIntensity.target as HTMLInputElement).value;
        }

        var regExp = new RegExp('^#[0-9A-Fa-f]{1,2}$');
        if (!regExp.test('#' + hexValue) && hexValue != '') {
            alert('Entrez une valeur en hexadécimal!');
        }

        let decimalValue = parseInt(hexValue, 16);

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

    setColor(primary: boolean) {
        if (primary) {
            this.colorService.primaryColor = this.color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.primaryOpacity);
        } else {
            this.colorService.secondaryColor = this.color;
            this.colorService.setSecondaryColorWithOpacity(this.colorService.secondaryOpacity);
        }
    }

    setColorPreview(primary: boolean) {
        if (primary) {
            this.colorService.primaryColorPreview = this.color;
            //this.colorService.setPrimaryColorWithOpacity(this.colorService.primaryOpacity);
        } else {
            this.colorService.secondaryColorPreview = this.color;
            //this.colorService.setSecondaryColorWithOpacity(this.colorService.secondaryOpacity);
        }
    }

    resetSelectedColors() {
        this.isRed = false;
        this.isGreen = false;
        this.isBlue = false;
    }

    isNumber(num: number): boolean {
        return !Number.isNaN(num);
    }

    colorToHex() {}

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
        if (this.contextmenu === false && this.mousedown === true) {
            this.adjustQueueWhenSelectingPrevious(color);
            this.colorService.primaryColor = color;
            this.colorService.setPrimaryColorWithOpacity(this.colorService.primaryOpacity);
        }
    }

    onRightClickDown(evt: MouseEvent, color: string): boolean {
        this.mousedown = evt.button === MouseButton.Left;
        this.contextmenu = true;
        this.adjustQueueWhenSelectingPrevious(color);
        this.colorService.secondaryColor = color;
        this.colorService.setSecondaryColorWithOpacity(this.colorService.secondaryOpacity);
        return false;
    }

    emitColor(color: string): void {
        this.colorEmitted.emit(color);
    }

    adjustQueueWhenSelectingPrevious(color: string) {
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

    // pickerClickHandler(evt: MouseEvent): void {
    //     this.mouseEvent = evt;
    //     this.colorService.showConfirmButton = true;
    //     //console.log(this.showConfirmButton);
    // }
}
