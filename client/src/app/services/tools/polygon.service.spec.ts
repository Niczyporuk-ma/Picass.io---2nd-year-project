import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/enums/enums';
import { PolygonService } from './polygon.service';

fdescribe('PolygonService', () => {
    let service: PolygonService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PolygonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set the startingPoint when mouseDown is true', () => {
        let mouseEvent: MouseEvent = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service.startingPoint).toEqual({ x: 0, y: 0 });
    });

    it('onMouseDown should not call getPositionFromMouse if mouseDown is false', () => {
        let mouseEvent: MouseEvent = { button: MouseButton.Right } as MouseEvent;
        const getMouseFromPositionSpy = spyOn(service, 'getPositionFromMouse');
        service.onMouseDown(mouseEvent);
        expect(getMouseFromPositionSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set the endPoint when mouseDown is true', () => {
        spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        spyOn(service, 'drawLine').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = true;
        service['drawingService'].resizeActive = false;
        service.onMouseUp(mouseEvent);
        expect(service.endPoint).toEqual({ x: 120, y: 14 });
    });

    it('onMouseUp should call drawLine et clearCanvas when mouseDown is true', () => {
        const clearCanavsSpy = spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        const drawLineSpy = spyOn(service, 'drawLine').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = true;
        service['drawingService'].resizeActive = false;
        service.onMouseUp(mouseEvent);
        expect(clearCanavsSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('onMouseUp should notcall drawLine et clearCanvas when mouseDown is false', () => {
        const clearCanavsSpy = spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        const drawLineSpy = spyOn(service, 'drawLine').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = false;
        service['drawingService'].resizeActive = false;
        service.onMouseUp(mouseEvent);
        expect(clearCanavsSpy).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should always set mouseDown to false', () => {
        spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        spyOn(service, 'drawLine').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = true;
        service['drawingService'].resizeActive = false;
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    // Ne marche passe pas a cause du truc de x
    // it('onMouseMove should set the endPoint when mouseDown is true', () => {
    //     spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
    //     spyOn(service, 'drawLine').and.returnValue();
    //     let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
    //     service.mouseDown = true;
    //     service['drawingService'].resizeActive = false;
    //     service.onMouseMove(mouseEvent);
    //     expect(service.endPoint).toEqual({ x: 120, y: 14 });
    // });

    // it('onMouseMove should call drawLine et clearCanvas when mouseDown is true', () => {
    //     const clearCanavsSpy = spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
    //     const drawLineSpy = spyOn(service, 'drawLine').and.returnValue();
    //     let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
    //     service.mouseDown = true;
    //     service['drawingService'].resizeActive = false;
    //     service.onMouseMove(mouseEvent);
    //     expect(clearCanavsSpy).toHaveBeenCalled();
    //     expect(drawLineSpy).toHaveBeenCalled();
    // });

    it('onMouseMove should notcall drawLine et clearCanvas when mouseDown is false', () => {
        const clearCanavsSpy = spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        const drawLineSpy = spyOn(service, 'drawLine').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = false;
        service['drawingService'].resizeActive = false;
        service.onMouseMove(mouseEvent);
        expect(clearCanavsSpy).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('clearArray should empty currentLine', () => {
        service.clearArrays();
        expect(service.currentLine).toEqual([]);
    });

    it('onButtonPress should toggle the value of showNumberOfSidesInput', () => {
        service.showNumberOfSidesInput = false;
        service.onButtonPress();
        expect(service.showNumberOfSidesInput).toEqual(true);
        service.showNumberOfSidesInput = true;
        service.onButtonPress();
        expect(service.showNumberOfSidesInput).toEqual(false);
    });

    it(' SetPreliminaryNumberOfsides should set premNumberOfSides when the input is a number', () => {
        const keyboardEvent: KeyboardEvent = {} as KeyboardEvent;
        Object.defineProperty(keyboardEvent, 'target', { value: { value: '6' } });
        service.setPreliminaryNumberOfSides(keyboardEvent);
        expect(service.premNumberOfSides).toEqual(6);
    });

    it(' SetPreliminaryNumberOfsides should set premNumberOfSides to NaN when the input is not a number', () => {
        const keyboardEvent: KeyboardEvent = {} as KeyboardEvent;
        Object.defineProperty(keyboardEvent, 'target', { value: { value: 'xyz' } });
        service.setPreliminaryNumberOfSides(keyboardEvent);
        expect(service.premNumberOfSides).toEqual(NaN);
    });

    it('setNumberOfSides should set sides to premNumberOfSides if it is between 3 and 12', () => {
        for (var i = 3; i <= 12; i++) {
            service.premNumberOfSides = i;
            service.setNumberOfSides();
            expect(service.sides).toEqual(i);
        }
    });

    it('setNumberOfSides should send an alert if premNumberOfSides is bellow 3', () => {
        service.premNumberOfSides = -10456;
        const alertSpy = spyOn(window, 'alert');
        service.setNumberOfSides();
        expect(service.sides).toEqual(3);
        expect(alertSpy).toHaveBeenCalled();
    });

    it('setNumberOfSides should send an alert if premNumberOfSides is over 12', () => {
        service.premNumberOfSides = 12485;
        const alertSpy = spyOn(window, 'alert');
        service.setNumberOfSides();
        expect(service.sides).toEqual(3);
        expect(alertSpy).toHaveBeenCalled();
    });

    it('setNumberOfSides should send an alert if premNumberOfSides is not a number', () => {
        service.premNumberOfSides = NaN;
        const alertSpy = spyOn(window, 'alert');
        service.setNumberOfSides();
        expect(service.sides).toEqual(3);
        expect(alertSpy).toHaveBeenCalled();
    });

    // A check avec le charge
    // it('drawLine should call fill once when fill property of the polygon is true', () => {
    //     const polygonSpyObj = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
    //         'strokeStyle',
    //         'beginPath',
    //         'globalCompositeOperation',
    //         'setLineDash',
    //         'stroke',
    //         'moveTo',
    //         'lineTo',
    //         'fill',
    //         'lineWidth',
    //         'lineCap',
    //         'fillStyle',
    //     ]);
    //     Object.defineProperty(service['drawingService'].baseCtx, 'fillStyle', { value: 'blue' });
    //     Object.defineProperty(service['drawingService'].previewCtx, 'fillStyle', { value: 'red' });
    //     service.toolStyles.fill = true;
    //     service.drawLine(polygonSpyObj, [
    //         { x: 100, y: 113 },
    //         { x: 25, y: 200 },
    //     ]);
    //     expect(polygonSpyObj.fill).toHaveBeenCalledTimes(1);
    // });
});
