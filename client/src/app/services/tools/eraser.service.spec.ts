import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser.service';

fdescribe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        // tslint:disable:no-magic-numbers

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'baseCtx.lineTo', 'baseCtx.moveTo', 'previewCtx.strokeRect']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EraserService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        // drawLineSpy = spyOn(service, 'drawLine').and.stub();
        // findCoordinateSpy = spyOn(service, 'findCoordinate').and.callThrough();
        // cursorEffectSpy = spyOn(service, 'cursorEffect').and.stub();

        service.drawingService.baseCtx = baseCtxStub;
        service.drawingService.previewCtx = previewCtxStub;

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

    it('mouseDown shouldnt call getPositionFromMouse if mouseDown is false', () => {
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.stub();
        service.mouseDown = false;
        mouseEvent = {
            offsetX: 35,
            offsetY: 35,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set mouseDown property to false', () => {
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseMove should call findCoordinate if mouse was not already down', () => {
        service.startingPoint = { x: 10, y: 30 };
        service.currentPoint = { x: 30, y: 10 };
        service.toolStyles.lineWidth = 10;
        service.mouseDown = false;
        service.mouseDownCoord = { x: 25, y: 25 };
        const findCoordinateSpy = spyOn(service, 'findCoordinate').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(findCoordinateSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call drawLine if mouse was already down', () => {
        service.startingPoint = { x: 10, y: 30 };
        service.currentPoint = { x: 30, y: 10 };
        service.mouseDownCoord = { x: 0, y: 0 };
        service.toolStyles.lineWidth = 5;
        service.mouseDown = true;
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    // Erreur bizzare ??
    it('findCoordinate should return the correct position to create the square effect of the eraser', () => {
        service.toolStyles.lineWidth = 20;
        service.currentPoint = { x: 30, y: 30 };
        const expectedResult: Vec2 = { x: 20, y: 20 };
        expect(service.findCoordinate()).toEqual(expectedResult);
    });

    it('onMouseMove should call findCoordinate if mouse was already down', () => {
        service.startingPoint = { x: 10, y: 30 };
        service.currentPoint = { x: 30, y: 10 };
        service.mouseDown = true;
        service.mouseDownCoord = { x: 25, y: 25 };
        const findCoordinateSpy = spyOn(service, 'findCoordinate').and.callThrough();
        service.onMouseMove(mouseEvent);
        expect(findCoordinateSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call cursorEffect two times if mouse was already down', () => {
        service.startingPoint = { x: 10, y: 30 };
        service.currentPoint = { x: 30, y: 10 };
        const cursorEffectSpy = spyOn(service, 'cursorEffect').and.stub();
        service.mouseDown = true;
        // service.mouseDownCoord = { x: 25, y: 25 };
        service.onMouseMove(mouseEvent);
        expect(cursorEffectSpy).toHaveBeenCalledTimes(2);
    });

    it('onMouseMove should call cursorEffect one time if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 25, y: 25 };
        const cursorEffectSpy = spyOn(service, 'cursorEffect').and.stub();
        service.onMouseMove(mouseEvent);
        expect(cursorEffectSpy).toHaveBeenCalledTimes(1);
    });

    // Fonctionne pas ->????
    it('drawLine should call moveTo and lineTo one time each', () => {
        service.startingPoint = { x: 10, y: 30 };
        service.currentPoint = { x: 30, y: 10 };
        const lineToSpy = spyOn(drawServiceSpy.baseCtx, 'lineTo').and.stub();
        const moveToSpy = spyOn(drawServiceSpy.baseCtx, 'moveTo').and.stub();
        service.drawLine(drawServiceSpy.baseCtx);
        expect(lineToSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
    });

    it('cursorEffect should set lineWidth to 1', () => {
        const mockLocation: Vec2 = { x: 2, y: 2 };
        service.toolStyles.lineWidth = 2;
        service.cursorEffect(mockLocation);
        expect(service.toolStyles.lineWidth).toEqual(1);
    });

    it('cursorEffect should call strokeRect', () => {
        const mockLocation: Vec2 = { x: 2, y: 2 };
        const strokeRectSpy = spyOn(drawServiceSpy.previewCtx, 'strokeRect').and.stub();
        service.cursorEffect(mockLocation);
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it('isValid should return false if the width is invalid', () => {
        const invalidWidth = -5;
        const result: boolean = service.isValid(invalidWidth);
        expect(result).not.toBeTrue();
    });

    it('isValid should return true if the width is valid', () => {
        const invalidWidth = 6;
        const result: boolean = service.isValid(invalidWidth);
        expect(result).toBeTrue();
    });

    it('changeWidth should set width as newValue it its valid', () => {
        const validWidth = 6;
        service.changeWidth(validWidth);
        expect(service.toolStyles.lineWidth).toEqual(validWidth);
    });

    it('changeWidth should set width as minimumWidth it its invalid', () => {
        const validWidth = 3;
        service.changeWidth(validWidth);
        expect(service.toolStyles.lineWidth).toEqual(service.minimumWidth);
    });
});
