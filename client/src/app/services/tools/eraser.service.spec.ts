import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser.service';

describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    // let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // let baseCtxStub: CanvasRenderingContext2D;
    // let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy;
    let cursorEffectSpy: jasmine.Spy;
    let findCoordinateSpy: jasmine.Spy;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EraserService);
        // canvasTestHelper = TestBed.inject(CanvasTestHelper);
        // baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        // previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawLineSpy = spyOn(service, 'drawLine').and.stub();
        findCoordinateSpy = spyOn(service, 'findCoordinate').and.stub();
        cursorEffectSpy = spyOn(service, 'cursorEffect').and.stub();

        // service['drawingService'].baseCtx = baseCtxStub;
        // service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 35,
            offsetY: 35,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseDown should set mouseDownCoord to the correct position', () => {
        const expectedResult: Vec2 = { x: 35, y: 35 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it('mouseDown should set mouseDown property to true on the left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it('onMouseUp should set mouseDown property to false', () => {
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseMove should call findCoordinate if mouse was not already down', () => {
        service.toolStyles.lineWidth = 10;
        service.mouseDown = false;
        service.mouseDownCoord = { x: 25, y: 25 };
        service.onMouseMove(mouseEvent);
        expect(findCoordinateSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.toolStyles.lineWidth = 5;
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    //Erreur bizzare ??
    it('findCoordinate should return the correct position to create the square effect of the eraser', () => {
        service.toolStyles.lineWidth = 20;
        service.currentPoint = { x: 30, y: 30 };
        const expectedResult: Vec2 = { x: 20, y: 20 };
        expect(service.findCoordinate()).toEqual(expectedResult);
    });

    it('onMouseMove should call findCoordinate if mouse was already down', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 25, y: 25 };
        service.onMouseMove(mouseEvent);
        expect(findCoordinateSpy).toHaveBeenCalled();
    });
   
    it('onMouseMove should call cursorEffect two times if mouse was already down', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 25, y: 25 };
        service.onMouseMove(mouseEvent);
        expect(cursorEffectSpy).toHaveBeenCalledTimes(2);
    });
    
    it('onMouseMove should call cursorEffect one time if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 25, y: 25 };
        service.onMouseMove(mouseEvent);
        expect(cursorEffectSpy).toHaveBeenCalledTimes(1);
    });

    //Fonctionne pas ->????
    it('drawLine should call moveTo and lineTo one time each', () => {
        service.startingPoint = {x: 10, y: 30};
        service.currentPoint = {x: 30, y: 10};
        const drawLineSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'beginPath',
            'lineWidth',
            'lineCap',
            'globalCompositeOperation',
            'moveTo',
            'lineTo',
            'stroke',
        ]);
        service.drawLine(drawLineSpyObject);
        expect(drawLineSpyObject.lineTo).toHaveBeenCalledTimes(1);
        expect(drawLineSpyObject.moveTo).toHaveBeenCalledTimes(1);
    });
});
