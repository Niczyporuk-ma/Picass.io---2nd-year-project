import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
    // tslint:disable:no-magic-numbers
    let component: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolbarComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
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

    it(' onPress should toggle the showPallet value', () => {
        component.showPalette = false;
        component.onPressPalette();
        expect(component.showPalette).toEqual(true);
        component.onPressPalette();
        expect(component.showPalette).toEqual(false);
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
});
