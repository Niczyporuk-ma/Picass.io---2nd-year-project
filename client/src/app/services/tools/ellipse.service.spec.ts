import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from './ellipse.service';

describe('EllipseService', () => {
    let service: EllipseService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'clearBackground']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipseService);

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        // tslint:disable:no-magic-numbers

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });
    it(' onMouseUp should call drawEllipse if mouse was already down', () => {
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();

        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);

        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawEllipse if mouse was not already down', () => {
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub(); // appeller la fonction original
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawEllipse if mouse was already down', () => {
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawEllipse if mouse was not already down', () => {
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call drawRectangle if shift is pressed', () => {
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        service.mouseDown = true;
        service.shiftIsPressed = true;
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('setShiftIsPressed does nothing if the key isnt shift', () => {
        const wrongEvent = new KeyboardEvent('keydown', { key: 'A' });
        service.shiftIsPressed = false;
        service.setShiftIfPressed(wrongEvent);
        expect(service.shiftIsPressed).toBeFalse();
    });

    it('setShiftPressed should have called both drawEllipse and drawRectangle if checkIsSquare returns false and mouseDown is true', () => {
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service.mouseDown = true;
        service['startingPoint'] = { x: 1, y: 5 };
        service['endPoint'] = { x: 5, y: 5 };

        service.setShiftIfPressed(event);
        expect(drawEllipseSpy).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
    });
    it('setShiftPressed shouldnt have called both drawEllipse and drawRectangle if checkIsSquare returns true', () => {
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        service.squareHelperService.checkIfIsSquare = () => {
            return true;
        };
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service['startingPoint'] = { x: 1, y: 5 };
        service['endPoint'] = { x: 5, y: 5 };

        service.setShiftIfPressed(event);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it('drawEllipse draws a circle when shiftIsPressed is true', () => {
        const arcSpy = spyOn(drawServiceSpy.baseCtx, 'arc').and.stub();
        service.shiftIsPressed = true;
        service.startingPoint = { x: 1, y: 1 };
        service.endPoint = { x: 2, y: 2 };
        service.drawEllipse(drawServiceSpy.baseCtx, service.startingPoint, service.endPoint);
        expect(arcSpy).toHaveBeenCalled();
    });

    it('drawEllipse draws an ellipse when shiftIsPressed is false', () => {
        const ellipseSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'ellipse',
            'beginPath',
            'setLineDash',
            'stroke',
        ]);
        service.shiftIsPressed = false;
        service.drawEllipse(ellipseSpyObject, { x: 1, y: 3 }, { x: 9, y: 6 });
        expect(ellipseSpyObject.ellipse).toHaveBeenCalledWith(5, 4.5, 1.5, 4, Math.PI / 2, 0, 2 * Math.PI);
    });

    it('drawEllipse should set strokeStyle as primaryColor if border is false', () => {
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        drawServiceSpy.baseCtx.strokeStyle = 'blue';
        service.border = false;
        service.drawEllipse(drawServiceSpy.baseCtx, service.startingPoint, service.endPoint);
        expect(drawServiceSpy.baseCtx.strokeStyle).toEqual('#000000');
    });

    it('drawEllipse should call setLineDash and fill if fill is true', () => {
        const setLineDashSpy = spyOn(drawServiceSpy.baseCtx, 'setLineDash').and.stub();
        const fillSpy = spyOn(drawServiceSpy.baseCtx, 'fill').and.stub();
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.toolStyles.fill = true;
        service.drawEllipse(drawServiceSpy.baseCtx, service.startingPoint, service.endPoint);
        expect(setLineDashSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('onShift sets isShiftPressed true', () => {
        service.isShiftPressed = false;
        service.onShift();
        expect(service.isShiftPressed).toEqual(true);
    });

    it('onShift doesnt add event listeners if isShiftPressed is true', () => {
        service.isShiftPressed = true;
        const eventListenerSpy = spyOn(window, 'addEventListener').and.stub();
        service.onShift();
        expect(eventListenerSpy).not.toHaveBeenCalled();
    });

    it('setShiftNonPressed sets shiftIsPressed and eventTest to false', () => {
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.mouseDown = false;
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service.setShiftNonPressed(event);
        expect(service.shiftIsPressed).toEqual(false);
        expect(service.isShiftPressed).toEqual(false);
    });

    it('setShiftNonPressed sets shiftIsPressed to false when mouseDown is false', () => {
        service.mouseDown = false;
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service.setShiftNonPressed(event);
        expect(service.shiftIsPressed).toEqual(false);
    });

    it('setShiftNonPressed calls clearCanvas, drawEllipse and drawRectangle if mouseDown is true', () => {
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.mouseDown = true;
        service.setShiftNonPressed(event);

        expect(drawEllipseSpy).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('setShiftNonPressed doesnt call drawEllipse and drawRectangle if mouseDown is false', () => {
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.mouseDown = false;
        service.setShiftNonPressed(event);

        expect(drawEllipseSpy).not.toHaveBeenCalled();
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it('drawRectangle should calls moveTo and lineTo 4 times', () => {
        const rectangleSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'strokeStyle',
            'beginPath',
            'globalCompositeOperation',
            'setLineDash',
            'stroke',
            'moveTo',
            'lineTo',
        ]);
        service.drawRectangle(rectangleSpyObject, { x: 1, y: 1 }, { x: 2, y: 2 });
        expect(rectangleSpyObject.lineTo).toHaveBeenCalledTimes(4);
        expect(rectangleSpyObject.moveTo).toHaveBeenCalledTimes(4);
    });

    it('changeWidth should change the width correctly', () => {
        service.changeWidth(10);
        expect(service.toolStyles.lineWidth).toEqual(10);
    });
});
