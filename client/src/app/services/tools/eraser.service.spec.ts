import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser.service';

describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy;
    let cursorEffectSpy: jasmine.Spy;
    let findCoordinateSpy: jasmine.Spy;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EraserService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawLineSpy = spyOn(service, 'drawLine').and.callThrough();
        findCoordinateSpy = spyOn(service, 'findCoordinate').and.callThrough();
        cursorEffectSpy = spyOn(service, 'cursorEffect').and.callThrough();

        //service['drawingService'].baseCtx = baseCtxStub;
        //service['drawingService'].previewCtx = previewCtxStub;

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
        service.mouseDown = false;
        service.mouseDownCoord = { x: 25, y: 25 };
        service.onMouseMove(mouseEvent);
        expect(findCoordinateSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('findCoordinate should set a Vec2 with correct coordinate', () => {
        const widthTest = 20;
        service.styles.lineWidth = widthTest;
        service.currentPoint = { x: 30, y: 30 };
        const expectedResult: Vec2 = service.findCoordinate();
        expect(expectedResult).toEqual({ x: 20, y: 20 });
    });

    it('onMouseMove should call findCoordinate if mouse was already down', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 25, y: 25 };
        service.onMouseMove(mouseEvent);
        expect(findCoordinateSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call cursorEffect if mouse was already down', () => {
        service.mouseDown = true;
        service.mouseDownCoord = { x: 25, y: 25 };
        service.onMouseMove(mouseEvent);
        expect(cursorEffectSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call cursorEffect if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 25, y: 25 };
        service.onMouseMove(mouseEvent);
        expect(cursorEffectSpy).not.toHaveBeenCalled();
    });
});
