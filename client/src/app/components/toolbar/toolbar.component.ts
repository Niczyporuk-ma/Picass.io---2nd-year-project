import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faPlusSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import { faEraser, faEyeDropper, faPalette, faPen, faSlash, faSprayCan } from '@fortawesome/free-solid-svg-icons';

const FILL_VALUE = '1';
const CONTOUR_VALUE = '2';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    tools: Tool[];
    showAdvanced: boolean = false;
    widthValue: number = this.toolManager.currentTool.toolStyles.lineWidth;
    faPen: IconDefinition = faPen;
    faSquare: IconDefinition = faSquare;
    faSlash: IconDefinition = faSlash;
    faEraser: IconDefinition = faEraser;
    faCircle: IconDefinition = faCircle;
    faPalette: IconDefinition = faPalette;
    faPlusSquare: IconDefinition = faPlusSquare;
    faEyeDropper: IconDefinition = faEyeDropper;
    faSprayCan: IconDefinition = faSprayCan;

    constructor(public toolManager: ToolManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
    }

    setRectangleStyle(recStyleCode: string): void {
        if (recStyleCode === FILL_VALUE) {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.contour = false;
        } else if (recStyleCode === CONTOUR_VALUE) {
            this.toolManager.rectangleService.toolStyles.fill = false;
            this.toolManager.rectangleService.contour = true;
        } else {
            this.toolManager.rectangleService.toolStyles.fill = true;
            this.toolManager.rectangleService.contour = true;
        }
    }

    onPressPalette(): void {
        this.toolManager.showPalette = !this.toolManager.showPalette;
    }

    showSaveDrawing(): void {
        this.toolManager.showSaveMenu = !this.toolManager.showSaveMenu;
    }

    setEllipseStyle(ellipseStyleCode: string): void {
        if (ellipseStyleCode === FILL_VALUE) {
            this.toolManager.ellipseService.toolStyles.fill = true;
            this.toolManager.ellipseService.border = false;
        } else if (ellipseStyleCode === CONTOUR_VALUE) {
            this.toolManager.ellipseService.toolStyles.fill = false;
            this.toolManager.ellipseService.border = true;
        } else {
            this.toolManager.ellipseService.toolStyles.fill = true;
            this.toolManager.ellipseService.border = true;
        }
    }

    setPolygonStyle(polyStyleCode: string): void {
        if (polyStyleCode === FILL_VALUE) {
            this.toolManager.polygonService.toolStyles.fill = true;
            this.toolManager.polygonService.contour = false;
        } else if (polyStyleCode === CONTOUR_VALUE) {
            this.toolManager.polygonService.toolStyles.fill = false;
            this.toolManager.polygonService.contour = true;
        } else {
            this.toolManager.polygonService.toolStyles.fill = true;
            this.toolManager.polygonService.contour = true;
        }
    }

    updateSliderWidth(): void {
        this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
    }

    setLineJunction(n: string): void {
        if (n === '0') {
            this.toolManager.lineService.hasJunction = false;
        } else {
            this.toolManager.lineService.hasJunction = true;
        }
    }

    changeDiameter(newDiameter: number): void {
        this.toolManager.lineService.currentDiameter = newDiameter;
    }

    changeWidth(width: number): void {
        this.toolManager.currentTool.changeWidth(width);
        this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
    }

    changeEmissionRate(rate: number): void {
        this.toolManager.airbrushService.emissionRate = rate;
    }

    changeJetDiameter(diameter: number): void {
        this.toolManager.airbrushService.jetDiameter = diameter;
    }

    changeDropletDiameter(diameter: number): void {
        this.toolManager.airbrushService.dropletDiameter = diameter;
    }
    disableShortcut(): void {
        this.toolManager.allowKeyPressEvents = false;
    }

    enableShortcut(): void {
        this.toolManager.allowKeyPressEvents = true;
    }
}
