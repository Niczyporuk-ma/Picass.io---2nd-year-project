// inspired by : https://malcoded.com/posts/angular-color-picker/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPaletteComponent } from './color-palette.component';
//import { SimpleChanges } from '@angular/core';

fdescribe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit should call draw', () => {
        const drawSpy = spyOn(component, 'draw');
        component.ngAfterViewInit();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('draw should call fillrect 3 times', () => {
        const fillRectSpy = spyOn(component['ctx'], 'fillRect');
        component.draw();
        expect(fillRectSpy).toHaveBeenCalledTimes(3);
    });

    it('draw should set strokestyle and fillstyle to white when slectedPosition is defined', () => {
        component.selectedPosition = { x: 0, y: 0 };
        component.draw();
        expect(component['ctx'].strokeStyle).toEqual('#ffffff');
        expect(component['ctx'].fillStyle).toEqual('#ffffff');
    });

    it('draw should call arc when slectedPosition is defined', () => {
        component.selectedPosition = { x: 0, y: 0 };
        const arcSpy = spyOn(component['ctx'], 'arc');
        component.draw();
        expect(arcSpy).toHaveBeenCalledWith(0, 0, 10, 0, 2 * Math.PI);
    });

    it('draw should set linewidth to basewidth when slectedPosition is defined', () => {
        component.selectedPosition = { x: 0, y: 0 };
        component.draw();
        expect(component['ctx'].lineWidth).toEqual(5);
    });

    it('draw should set linewidth to basewidth when slectedPosition is defined', () => {
        //let changes: {hue: '#ffffff'} as SimpleChanges;
    });
});
