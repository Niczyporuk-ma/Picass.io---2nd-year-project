import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineServiceService } from './line-service.service';

describe('LineService', () => {
    let service: LineServiceService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']); //un genre de proxy

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LineServiceService);

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

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        const drawLineSpy: jasmine.Spy<any> = spyOn<any>(service, 'drawLine').and.stub();
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' mouseClick should set startingPosition to correct position when the line is not started', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.isStarted = false;
        service.onMouseClick(mouseEvent);
        expect(service.startingPoint).toEqual(expectedResult);
    });

    // probleme du set dans drawline
    /*it(' mouseClick should set endingPosition to correct position when the line is started', () => {
        
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.isStarted = true;
        service.onMouseClick(mouseEvent);
        expect(service.endingPosition).toEqual(expectedResult);
    });*/

    /*
    it(' mouseClick should call drawLine() when endingPoint is set', () => {
        service.isStarted = true;
        service.onMouseClick(mouseEvent);
        const drawLineSpy : jasmine.Spy<any> = spyOn<any>(service, 'drawLine').and.stub();
        expect(drawLineSpy).toHaveBeenCalled();
    });
    */
});
