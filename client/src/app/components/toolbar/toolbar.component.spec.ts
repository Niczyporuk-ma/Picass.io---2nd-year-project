import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
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
    let component: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;
    let modal: MatDialog;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolbarComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: MatDialog, useClass: MatDialogMock }],
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

    it('export should open a modal window', () => {
        spyOn(modal, 'open').and.callThrough();
        component.export();
        expect(modal.open).toHaveBeenCalledWith(ExportDrawingComponent);
    });
});
