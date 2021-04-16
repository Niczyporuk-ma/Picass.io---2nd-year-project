import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { FormComponent } from '@app/components/form/form.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutEventOutput, ShortcutInput } from 'ng-keyboard-shortcuts';
import { ToolbarComponent } from './toolbar.component';

class MatDialogMock {
    // tslint:disable-next-line:no-any
    openDialogs: MatDialogRef<any>[] = [];
    open(): {} {
        return {};
    }
}

describe('ToolbarComponent', () => {
    // tslint:disable:no-magic-numbers
    // tslint:disable:max-file-line-count
    let component: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;
    let modal: MatDialog;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let ctxSpyObject: jasmine.SpyObj<CanvasRenderingContext2D>;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawingServiceSpy.canvas = document.createElement('canvas');
        ctxSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'strokeStyle',
            'beginPath',
            'moveTo',
            'lineTo',
            'stroke',
        ]);
        drawingServiceSpy.gridCtx = ctxSpyObject;
        TestBed.configureTestingModule({
            declarations: [ToolbarComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        modal = TestBed.inject(MatDialog);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setRectangleStyle puts fill to true and contour to false when n = 1', () => {
        component.setRectangleStyle('1');
        expect(component.toolManager.rectangleService.toolStyles.fill).toEqual(true);
        expect(component.toolManager.rectangleService.contour).toEqual(false);
    });

    it('setRectangleStyle puts fill to false and contour to true when n = 2', () => {
        component.setRectangleStyle('2');
        expect(component.toolManager.rectangleService.toolStyles.fill).toEqual(false);
        expect(component.toolManager.rectangleService.contour).toEqual(true);
    });

    it('setRectangleStyle puts fill to true and contour to true when n = 3', () => {
        component.setRectangleStyle('3');
        expect(component.toolManager.rectangleService.toolStyles.fill).toEqual(true);
        expect(component.toolManager.rectangleService.contour).toEqual(true);
    });

    it('setEllipseStyle puts fill to true and contour to false when n = 1', () => {
        component.setEllipseStyle('1');
        expect(component.toolManager.ellipseService.toolStyles.fill).toEqual(true);
        expect(component.toolManager.ellipseService.border).toEqual(false);
    });

    it('setEllipseStyle puts fill to false and contour to true when n = 2', () => {
        component.setEllipseStyle('2');
        expect(component.toolManager.ellipseService.toolStyles.fill).toEqual(false);
        expect(component.toolManager.ellipseService.border).toEqual(true);
    });

    it('setEllipseStyle puts fill to true and contour to true when anything else than 0 and 1', () => {
        component.setEllipseStyle('3');
        expect(component.toolManager.ellipseService.toolStyles.fill).toEqual(true);
        expect(component.toolManager.ellipseService.border).toEqual(true);
    });

    it(' onPressPalette should toggle the showPallet value', () => {
        component.toolManager.showPalette = false;
        component.onPressPalette();
        expect(component.toolManager.showPalette).toEqual(true);
        component.onPressPalette();
        expect(component.toolManager.showPalette).toEqual(false);
    });

    it('uptadeSliderWidth should uptade the widthValue of the toolManager with the width of the current tool', () => {
        component.toolManager.setTool(component.toolManager.pencilService);
        component.toolManager.currentTool.toolStyles.lineWidth = 10;
        component.updateSliderWidth();
        expect(component.toolManager.widthValue).toEqual(10);
    });

    it(' setLineJunction puts hasJunction of line service to false if n = 0', () => {
        component.setLineJunction('0');
        expect(component.toolManager.lineService.hasJunction).toEqual(false);
    });

    it(' setLineJunction puts hasJunction to true if n != 0', () => {
        component.setLineJunction('1');
        expect(component.toolManager.lineService.hasJunction).toEqual(true);
    });

    it(' changeDiametre sets the diameter of the line service', () => {
        component.changeDiameter(10);
        expect(component.toolManager.lineService.currentDiameter).toEqual(10);
    });

    it(' setLineJunction puts hasJunction to false is n = 0', () => {
        component.setLineJunction('0');
        expect(component.toolManager.lineService.hasJunction).toEqual(false);
    });

    it(' changeWidth should call changeWidth of the current tool', () => {
        const changeWidhtSpy = spyOn(component.toolManager.currentTool, 'changeWidth').and.callThrough();
        component.changeWidth(25);
        expect(changeWidhtSpy).toHaveBeenCalled();
    });

    it(' changeWidth should the widht of the tool manager', () => {
        component.changeWidth(25);
        expect(component.toolManager.widthValue).toEqual(25);
    });

    it(' changeEmissionRate should call the emissionRate of the airbrushService', () => {
        component.changeEmissionRate(25);
        expect(component.toolManager.airbrushService.emissionRate).toEqual(25);
    });

    it(' changeJetDiameter should change the diameter of the spray jet', () => {
        component.changeJetDiameter(1.5);
        expect(component.toolManager.airbrushService.jetDiameter).toEqual(1.5);
    });

    it(' changeDropletDiameter should the droplet diameter of the spray in airbushService', () => {
        component.changeDropletDiameter(0.2);
        expect(component.toolManager.airbrushService.dropletDiameter).toEqual(0.2);
    });
    it(' disableShortcut shouls set allowKeyPressEvent to false', () => {
        component.toolManager.allowKeyPressEvents = true;
        component.disableShortcut();
        expect(component.toolManager.allowKeyPressEvents).toEqual(false);
    });

    it(' enableShortcut shouls set allowKeyPressEvent to true', () => {
        component.toolManager.allowKeyPressEvents = false;
        component.enableShortcut();
        expect(component.toolManager.allowKeyPressEvents).toEqual(true);
    });

    it('setPolygonStyle puts fill to true and contour to false when n = 1', () => {
        component.setPolygonStyle('1');
        expect(component.toolManager.polygonService.toolStyles.fill).toEqual(true);
        expect(component.toolManager.polygonService.contour).toEqual(false);
    });

    it('setPolygonStyle puts fill to false and contour to true when n = 2', () => {
        component.setPolygonStyle('2');
        expect(component.toolManager.polygonService.toolStyles.fill).toEqual(false);
        expect(component.toolManager.polygonService.contour).toEqual(true);
    });

    it('setPolygonStyle puts fill to true and contour to true when n = 3', () => {
        component.setPolygonStyle('3');
        expect(component.toolManager.polygonService.toolStyles.fill).toEqual(true);
        expect(component.toolManager.polygonService.contour).toEqual(true);
    });

    it('export should open a modal window for the ExportDrawingComponent', () => {
        spyOn(modal, 'open').and.callThrough();
        component.export();
        expect(modal.open).toHaveBeenCalledWith(ExportDrawingComponent);
    });

    it('openSaveDrawingForm should open a modal window for the FormComponent', () => {
        spyOn(modal, 'open').and.callThrough();
        component.openSaveDrawingForm();
        expect(modal.open).toHaveBeenCalledWith(FormComponent);
    });

    it('openCarousel should open a modal window', () => {
        spyOn(modal, 'open').and.callThrough();
        component.openCarousel();
        expect(modal.open).toHaveBeenCalled();
    });

    it(' showGrid should change the isGridVisible boolean of gridService every time it is called', () => {
        component.gridService.isGridVisible = false;
        component.showGrid();
        expect(component.gridService.isGridVisible).toBe(true);
        component.showGrid();
        expect(component.gridService.isGridVisible).toBe(false);
    });

    it(' showGrid should call drawGrid if isGridVisible of gridService was initially false', () => {
        component.gridService.isGridVisible = false;
        const drawGridSpy = spyOn(component.gridService, 'drawGrid').and.callThrough();
        component.showGrid();
        expect(drawGridSpy).toHaveBeenCalled();
    });

    it(' showGrid should call eraseGridSpy if isGridVisible of gridService was initially true', () => {
        component.gridService.isGridVisible = true;
        const eraseGridSpy = spyOn(component.gridService, 'eraseGrid').and.callThrough();
        component.showGrid();
        expect(eraseGridSpy).toHaveBeenCalled();
    });

    it(' changeGridOpacity should change lineOpacity and call drawGrid from the grid service', () => {
        const newOpacity = 0.35;
        const drawGridSpy = spyOn(component.gridService, 'drawGrid').and.callThrough();
        component.changeGridOpacity(newOpacity);
        expect(component.gridService.lineOpacity).toEqual(0.35);
        expect(drawGridSpy).toHaveBeenCalled();
    });

    it(' changeSquareSize should the squaresize and call drawGrid from the grid service', () => {
        const newSquareSize = 15;
        const drawGridSpy = spyOn(component.gridService, 'drawGrid').and.callThrough();
        component.changeSquareSize(newSquareSize);
        expect(component.gridService.squareSize).toEqual(15);
        expect(drawGridSpy).toHaveBeenCalled();
    });

    it(' increaseSquareSizebyByFactor should increase the square size by 5 everytime it is called', () => {
        component.gridService.squareSize = 5;
        component.increaseSquareSizebyByFactor();
        expect(component.gridService.squareSize).toEqual(10);
        component.increaseSquareSizebyByFactor();
        expect(component.gridService.squareSize).toEqual(15);
    });

    it(' increaseSquareSizebyByFactor should not increase the square size if it is 100 or above', () => {
        component.gridService.squareSize = 95;
        component.increaseSquareSizebyByFactor();
        expect(component.gridService.squareSize).toEqual(100);
        component.increaseSquareSizebyByFactor();
        expect(component.gridService.squareSize).not.toEqual(105);
    });

    it(' decreaseSquareSizebyByFactor should decrease the square size by 5 everytime it is called', () => {
        component.gridService.squareSize = 20;
        component.decreaseSquareSizebyByFactor();
        expect(component.gridService.squareSize).toEqual(15);
        component.decreaseSquareSizebyByFactor();
        expect(component.gridService.squareSize).toEqual(10);
    });

    it(' decreaseSquareSizebyByFactor should not decrease the square size if it is 5 or smaller', () => {
        component.gridService.squareSize = 10;
        component.decreaseSquareSizebyByFactor();
        expect(component.gridService.squareSize).toEqual(5);
        component.decreaseSquareSizebyByFactor();
        expect(component.gridService.squareSize).not.toEqual(0);
    });

    it(' ctrl + g should call openCarousel but should not open the grid', () => {
        const ctrlG = component.shortcuts.find((x) => x.key === 'ctrl + g');
        const g = component.shortcuts.find((x) => x.key === 'g');
        const gSpy = spyOn(g as ShortcutInput, 'command').and.callThrough();
        const keyboardEvent = new KeyboardEvent('keydown', { ctrlKey: true, key: 'g' });
        const openCarouselSpy = spyOn(component, 'openCarousel').and.callThrough();
        const showGridSpy = spyOn(component, 'showGrid').and.callThrough();
        ctrlG?.command({ event: keyboardEvent, key: 'g' } as ShortcutEventOutput);
        expect(openCarouselSpy).toHaveBeenCalled();
        expect(gSpy).not.toHaveBeenCalled();
        expect(showGridSpy).not.toHaveBeenCalled(); // not opening the grid
    });

    it(' the shortcut g should call showGrid but should not open the carrousel', () => {
        const g = component.shortcuts.find((x) => x.key === 'g');
        const gSpy = spyOn(g as ShortcutInput, 'command').and.callThrough();
        const showGridSpy = spyOn(component, 'showGrid').and.callThrough();
        const ctrlG = component.shortcuts.find((x) => x.key === 'ctrl + g');
        const ctrlGSpy = spyOn(ctrlG as ShortcutInput, 'command').and.callThrough();
        const openCarouselSpy = spyOn(component, 'openCarousel').and.callThrough();
        const keyboardEvent = new KeyboardEvent('keydown', { ctrlKey: true, key: 'g' });
        g?.command({ event: keyboardEvent, key: 'g' } as ShortcutEventOutput);
        expect(gSpy).toHaveBeenCalled();
        expect(showGridSpy).toHaveBeenCalled();
        expect(ctrlGSpy).not.toHaveBeenCalled();
        expect(openCarouselSpy).not.toHaveBeenCalled();
    });

    it(' ctrl + s should open the savingDrawingForm modal', () => {
        const ctrlS = component.shortcuts.find((x) => x.key === 'ctrl + s');
        const ctrlG = component.shortcuts.find((x) => x.key === 'ctrl + g');
        const ctrlGSpy = spyOn(ctrlG as ShortcutInput, 'command').and.callThrough();
        const keyboardEvent = new KeyboardEvent('keydown', { ctrlKey: true, key: 's' });
        const openSaveDrawingFormSpy = spyOn(component, 'openSaveDrawingForm').and.callThrough();
        ctrlS?.command({ event: keyboardEvent, key: 's' } as ShortcutEventOutput);
        expect(openSaveDrawingFormSpy).toHaveBeenCalled();
        expect(ctrlGSpy).not.toHaveBeenCalled();
    });

    it(' ctrl + e should open the exportDrawing modal', () => {
        const ctrlE = component.shortcuts.find((x) => x.key === 'ctrl + e');
        const ctrlG = component.shortcuts.find((x) => x.key === 'ctrl + g');
        const ctrlGSpy = spyOn(ctrlG as ShortcutInput, 'command').and.callThrough();
        const keyboardEvent = new KeyboardEvent('keydown', { ctrlKey: true, key: 'e' });
        const exportSpy = spyOn(component, 'export').and.callThrough();
        ctrlE?.command({ event: keyboardEvent, key: 'e' } as ShortcutEventOutput);
        expect(exportSpy).toHaveBeenCalled();
        expect(ctrlGSpy).not.toHaveBeenCalled();
    });

    it('the shortcut = should call increaseSquareSizebyByFactor', () => {
        const equals = component.shortcuts.find((x) => x.key === '=');
        const ctrlG = component.shortcuts.find((x) => x.key === 'ctrl + g');
        const ctrlGSpy = spyOn(ctrlG as ShortcutInput, 'command').and.callThrough();
        const keyboardEvent = new KeyboardEvent('keydown', { ctrlKey: false, key: '=' });
        const exportSpy = spyOn(component, 'increaseSquareSizebyByFactor').and.callThrough();
        equals?.command({ event: keyboardEvent, key: '=' } as ShortcutEventOutput);
        expect(exportSpy).toHaveBeenCalled();
        expect(ctrlGSpy).not.toHaveBeenCalled();
    });

    it('ctrl + = should call increaseSquareSizebyByFactor', () => {
        const ctrlEquals = component.shortcuts.find((x) => x.key === 'ctrl + =');
        const ctrlG = component.shortcuts.find((x) => x.key === 'ctrl + g');
        const ctrlGSpy = spyOn(ctrlG as ShortcutInput, 'command').and.callThrough();
        const keyboardEvent = new KeyboardEvent('keydown', { ctrlKey: true, key: '=' });
        const increaseSquareSizebyByFactorSpy = spyOn(component, 'increaseSquareSizebyByFactor').and.callThrough();
        ctrlEquals?.command({ event: keyboardEvent, key: '=' } as ShortcutEventOutput);
        expect(increaseSquareSizebyByFactorSpy).toHaveBeenCalled();
        expect(ctrlGSpy).not.toHaveBeenCalled();
    });

    it('the shortcut - should call decreaseSquareSizebyByFactor', () => {
        const equals = component.shortcuts.find((x) => x.key === '-');
        const ctrlG = component.shortcuts.find((x) => x.key === 'ctrl + g');
        const ctrlGSpy = spyOn(ctrlG as ShortcutInput, 'command').and.callThrough();
        const keyboardEvent = new KeyboardEvent('keydown', { ctrlKey: false, key: '-' });
        const decreaseSquareSizebyByFactorSpy = spyOn(component, 'decreaseSquareSizebyByFactor').and.callThrough();
        equals?.command({ event: keyboardEvent, key: '-' } as ShortcutEventOutput);
        expect(decreaseSquareSizebyByFactorSpy).toHaveBeenCalled();
        expect(ctrlGSpy).not.toHaveBeenCalled();
    });

    it(' rotateStamp sets the rotationAngle of the stamp service', () => {
        component.rotateStamp(50);
        expect(component.toolManager.stampService.rotationAngle).toEqual(50);
    });

    it(' changeStamp size sets the stampSize of the stamp service', () => {
        component.changeStampSize(75);
        expect(component.toolManager.stampService.stampSize).toEqual(75);
    });

    it(' setStampStyle sets the stamp image of the stamp service', () => {
        component.setStampStyle(5);
        expect(component.toolManager.stampService.stampName).toEqual('assets/5.png');
    });
});
