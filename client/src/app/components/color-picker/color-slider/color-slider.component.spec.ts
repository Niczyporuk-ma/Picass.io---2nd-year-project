// inspired by : https://malcoded.com/posts/angular-color-picker/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//import { ColorService } from '@app/services/tools/color.service';
import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;
    //let service: ColorService;
    // tslint:disable:no-magic-numbers

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngAfterViewInit should call draw()', () => {
        const drawSpy = spyOn(component, 'draw').and.stub();
        component.ngAfterViewInit();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseUp should make mouseDown false', () => {
        component['mouseDown'] = true;
        component.onMouseUp();
        expect(component['mouseDown']).toEqual(false);
    });

    it('onMouseDown should make mouseDown true, set selectedHeight to evt.offsetY, call draw and call emitColor with evt.offsetX and evt.offsetY', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        const drawSpy = spyOn(component, 'draw').and.stub();
        const emitColorSpy = spyOn(component, 'emitColor').and.stub();
        component.onMouseDown(mouseEventLClick);
        expect(component['mouseDown']).toEqual(true);
        expect(component['selectedHeight']).toEqual(mouseEventLClick.offsetY);
        expect(drawSpy).toHaveBeenCalled();
        expect(emitColorSpy).toHaveBeenCalledWith(mouseEventLClick.offsetX, mouseEventLClick.offsetY);
    });

    it('onMouseMove should set selectedHeight to evt.offsetY, call draw and call emitColor with evt.offsetX and evt.offsetY if mousedown is true', () => {
        component['mouseDown'] = true;
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        const drawSpy = spyOn(component, 'draw').and.stub();
        const emitColorSpy = spyOn(component, 'emitColor').and.stub();
        component.onMouseMove(mouseEventLClick);
        expect(component['selectedHeight']).toEqual(mouseEventLClick.offsetY);
        expect(drawSpy).toHaveBeenCalled();
        expect(emitColorSpy).toHaveBeenCalledWith(mouseEventLClick.offsetX, mouseEventLClick.offsetY);
    });

    it('emitColor should call getColorAtPosition with x and y and emit with the result of getColorAtPosition', () => {
        const getColorAtPositionSpy = spyOn(component, 'getColorAtPosition').and.callThrough();
        const emitSpy = spyOn(component.color, 'emit').and.stub();
        const x: number = -2;
        const y: number = 55;
        component.emitColor(x, y);
        expect(getColorAtPositionSpy).toHaveBeenCalledWith(x, y);
        expect(emitSpy).toHaveBeenCalledWith(component.getColorAtPosition(x, y));
    });

    it('getColorAtPosition should call getImageData and return the data in string format', () => {
        const x: number = 9;
        const y: number = 85;
        const getImageDataSpy = spyOn(component['ctx'], 'getImageData').and.callThrough(); //and.stub will prevent functions from being called later
        component.getColorAtPosition(x, y);
        expect(getImageDataSpy).toHaveBeenCalledWith(x, y, 1, 1);
        expect(component.getColorAtPosition(x, y)).toEqual('rgba(0,255,3,1)');
    });

    it('getColorAtPosition should call getImageData and return the data in string format', () => {
        const x: number = 9;
        const y: number = 85;
        const getImageDataSpy = spyOn(component['ctx'], 'getImageData').and.callThrough(); //and.stub will prevent functions from being called later
        component.getColorAtPosition(x, y);
        expect(getImageDataSpy).toHaveBeenCalledWith(x, y, 1, 1);
        expect(component.getColorAtPosition(x, y)).toEqual('rgba(0,255,3,1)');
    });

    it('draw should call clearRect', () => {
        const clearRectSpy = spyOn(component['ctx'], 'clearRect').and.stub();
        component.draw();
        expect(clearRectSpy).toHaveBeenCalledWith(0, 0, 50, 250);
    });

    it('draw should affect ctx if ctx is undefined', () => {
        //component['ctx'] is initially undefined, therefore is it enters the first if it becomes defined
        component.draw();
        expect(component['ctx']).toEqual(component.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D);
    });

    it('draw should always call rect and fill', () => {
        const rectSpy = spyOn(component['ctx'], 'rect').and.stub();
        const fillSpy = spyOn(component['ctx'], 'fill').and.stub();
        component.draw();
        expect(rectSpy).toHaveBeenCalledWith(0, 0, 50, 250);
        expect(fillSpy).toHaveBeenCalledWith();
    });

    it('draw should affect strokeStyle with white and lineWidth with 5 when selectedHeight exists', () => {
        component['selectedHeight'] = 10;
        component.draw();
        expect(component['ctx'].strokeStyle).toEqual('#ffffff');
        expect(component['ctx'].lineWidth).toEqual(5);
    });

    it('draw should should call rect twice if selectedHeight exists', () => {
        component['selectedHeight'] = 10;
        const rectSpy = spyOn(component['ctx'], 'rect').and.stub();
        component.draw();
        expect(rectSpy).toHaveBeenCalledWith(0, 0, 50, 250); //first call to rect
        expect(rectSpy).toHaveBeenCalledWith(0, 5, 50, 10); // second call to rect
    });
});
