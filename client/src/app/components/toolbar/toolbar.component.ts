import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Tool } from '@app/classes/tool';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { FormComponent } from '@app/components/form/form.component';
import { GridService } from '@app/services/grid/grid.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCircle, faPlusSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import {
    faDownload,
    faEraser,
    faEyeDropper,
    faImages,
    faPalette,
    faPen,
    faPlay,
    faRedoAlt,
    faSave,
    faSlash,
    faSprayCan,
    faStamp,
    faTh,
    faUndoAlt,
    faVectorSquare,
} from '@fortawesome/free-solid-svg-icons';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

const FILL_VALUE = '1';
const CONTOUR_VALUE = '2';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
    shortcuts: ShortcutInput[] = [];
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
    faDownload: IconDefinition = faDownload;
    faEyeDropper: IconDefinition = faEyeDropper;
    faSprayCan: IconDefinition = faSprayCan;
    faImages: IconDefinition = faImages;
    faSave: IconDefinition = faSave;
    faUndoAlt: IconDefinition = faUndoAlt;
    faRedoAlt: IconDefinition = faRedoAlt;
    faTh: IconDefinition = faTh;
    faStamp: IconDefinition = faStamp;
    faVectorSquare: IconDefinition = faVectorSquare;
    faPlay: IconDefinition = faPlay;

    constructor(
        public toolManager: ToolManagerService,
        public undoRedoManager: UndoRedoManagerService,
        public modal: MatDialog,
        public gridService: GridService,
    ) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
        // source: https://www.npmjs.com/package/ng-keyboard-shortcuts
        this.shortcuts.push(
            {
                key: 'ctrl + g',
                preventDefault: true,
                command: () => {
                    this.openCarousel();
                    this.toolManager.setTool(this.toolManager.noToolService);
                },
            },
            {
                key: 'ctrl + s',
                preventDefault: true,
                command: () => {
                    this.openSaveDrawingForm();
                    this.toolManager.setTool(this.toolManager.noToolService);
                },
            },
            {
                key: 'g',
                preventDefault: true,
                command: () => this.showGrid(),
            },
            {
                key: '=',
                preventDefault: true,
                command: () => this.increaseSquareSizebyByFactor(),
            },
            {
                key: 'ctrl + =',
                preventDefault: true,
                command: () => this.increaseSquareSizebyByFactor(),
            },
            {
                key: '-',
                preventDefault: true,
                command: () => this.decreaseSquareSizebyByFactor(),
            },
            {
                key: 'ctrl + e',
                preventDefault: true,
                command: () => {
                    this.export();
                    this.toolManager.setTool(this.toolManager.noToolService);
                },
            },
        );
        this.undoRedoManager = undoRedoManager;
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

    showGrid(): void {
        this.gridService.isGridVisible = !this.gridService.isGridVisible;
        if (this.gridService.isGridVisible) {
            this.gridService.drawGrid();
        } else {
            this.gridService.eraseGrid();
        }
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

    export(): void {
        this.modal.open(ExportDrawingComponent);
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

    openCarousel(): void {
        this.modal.open(CarrouselComponent);
    }

    openSaveDrawingForm(): void {
        this.modal.open(FormComponent);
    }

    changeGridOpacity(opacity: number): void {
        this.gridService.lineOpacity = opacity;
        this.gridService.drawGrid();
    }

    changeSquareSize(size: number): void {
        this.gridService.squareSize = size;
        this.gridService.drawGrid();
    }

    increaseSquareSizebyByFactor(): void {
        const increaseFactor = 5;
        const maxSquareSize = 100;
        if (this.gridService.squareSize < maxSquareSize) {
            this.changeSquareSize(this.gridService.squareSize + increaseFactor);
        }
    }
    decreaseSquareSizebyByFactor(): void {
        const decreaseFactor = 5;
        const minSquareSize = 5;
        if (this.gridService.squareSize > minSquareSize) {
            this.changeSquareSize(this.gridService.squareSize - decreaseFactor);
        }
    }

    rotateStamp(rotationAngle: number): void {
        this.toolManager.stampService.rotationAngle = rotationAngle;
    }

    changeStampSize(newSize: number): void {
        this.toolManager.stampService.stampSize = newSize;
    }

    setStampStyle(stampNb: number): void {
        this.toolManager.stampService.stampName = 'assets/' + stampNb + '.png';
    }
}
