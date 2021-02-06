import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from './rectangle.service';

describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']); // un genre de proxy

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(RectangleService);

        // Configuration du spy du service
        // tslint:disable:no-string-literal
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

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.stub();

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        const drawLineSpy: jasmine.Spy<any> = spyOn<any>(service, 'drawLine').and.stub();
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should  call drawLine if shiftIsPresse & moveDown are true and we already have a square', () => {
        service.mouseDown = true;
        service.shiftIsPressed = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service['startingPoint'] = { x: 1, y: 5 };
        service['endPoint'] = { x: 5, y: 1 };
        const drawLineSpy: jasmine.Spy<any> = spyOn<any>(service, 'drawLine').and.stub();
        service.onMouseMove(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should  call drawLine if shiftIsPresse & moveDown are true and we dont already have a square', () => {
        service.mouseDown = true;
        service.shiftIsPressed = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service['startingPoint'] = { x: 1, y: 5 };
        service['endPoint'] = { x: 9, y: 1 };
        const drawLineSpy: jasmine.Spy<any> = spyOn<any>(service, 'drawLine').and.stub();
        service.onMouseMove(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if shiftIsPresse is false & moveDown is true', () => {
        service.mouseDown = true;
        service.shiftIsPressed = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        service['startingPoint'] = { x: 1, y: 5 };
        service['endPoint'] = { x: 9, y: 1 };
        const drawLineSpy: jasmine.Spy<any> = spyOn<any>(service, 'drawLine').and.stub();
        service.onMouseMove(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should  not call drawLine if mouseDown is false true', () => {
        service.mouseDown = false;
        const drawLineSpy: jasmine.Spy<any> = spyOn<any>(service, 'drawLine').and.stub();
        service.onMouseMove(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    // PROBLEMATIQUE
    /* it(' onMouseMove should not call closestSquare when we already have a square', () => {
        service.mouseDown = true;
        service.shiftIsPressed = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service['startingPoint'] = { x: 1, y: 5 };
        service['endPoint'] = { x: 5, y: 5 };
        const closestSquareSpy: jasmine.Spy<any> = spyOn<any>(service['squareHelperService'], 'closestSquare').and.stub();
        service.onMouseMove(mouseEvent);
        expect(closestSquareSpy).not.toHaveBeenCalled();
        //expect(service.currentLine).toEqual([{x:1,y:5},{x:5,y:1}]);
    });*/

    it('setShiftPressed should have called both drawEllipse and drawRectangle', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.stub();

        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service['startingPoint'] = { x: 1, y: 5 };
        service['endPoint'] = { x: 5, y: 5 };

        service.setShiftIfPressed(event);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('setShiftNonPressed sets shifts shiftIsPressed and eventTest to false when mouseDown is true', () => {
        service.mouseDown = true;
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service['startingPoint'] = { x: 1, y: 5 };
        service['endPoint'] = { x: 5, y: 5 };
        service.setShiftNonPressed(event);
        expect(service.shiftIsPressed).toEqual(false);
        expect(service.eventListenerIsSet).toEqual(false);
    });

    it('setShiftNonPressed sets shifts shiftIsPressed to false when mouseDown is false', () => {
        service.mouseDown = false;
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service.setShiftNonPressed(event);
        expect(service.shiftIsPressed).toEqual(false);
    });

    it('onShift returns eventTest true', () => {
        service.eventListenerIsSet = false;
        service.onShift();
        expect(service.eventListenerIsSet).toEqual(true);
    });

    it('drawLine should calls fillRect when toolStyle.fill is true', () => {
        const rectangleSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'strokeStyle',
            'beginPath',
            'globalCompositeOperation',
            'setLineDash',
            'stroke',
            'moveTo',
            'lineTo',
            'fillRect',
        ]);
        service.toolStyles.fill = true;
        service.drawLine(rectangleSpyObject, [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
        ]);
        expect(rectangleSpyObject.fillRect).toHaveBeenCalled();
    });

    it('drawLine should calls moveTo and lineTo 4 times', () => {
        const rectangleSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'strokeStyle',
            'beginPath',
            'globalCompositeOperation',
            'setLineDash',
            'stroke',
            'moveTo',
            'lineTo',
        ]);
        service.drawLine(rectangleSpyObject, [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
        ]);
        expect(rectangleSpyObject.lineTo).toHaveBeenCalledTimes(4);
        expect(rectangleSpyObject.moveTo).toHaveBeenCalledTimes(4);
    });
});
