import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AirbrushService } from './airbrush.service';

fdescribe('AirbrushService', () => {
    let service: AirbrushService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    // let timerCallback: jasmine.SpyObj<number>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        jasmine.clock().install();

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(AirbrushService);

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        // tslint:disable:no-magic-numbers
        // tslint:disable: no-unused-expression
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 65,
            offsetY: 1000,
            button: 0,
        } as MouseEvent;
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedPosition: Vec2 = { x: 65, y: 1000 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedPosition);
    });

    it(' mouseDown should call clearPath() method', () => {
        const clearPathSpy = spyOn(service, 'clearPath').and.stub();
        service.onMouseDown(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it('clearPath should set pathData to []', () => {
        service.clearPath();
        expect(service['pathData']).toEqual([]);
    });

    it(' onMouseDown should call spray every 100 ms', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service['pathData'] = [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
        ];
        service.mouseDown = true;
        service.onMouseDown(mouseEvent);
        const spraySpy = spyOn(service, 'spray').and.stub();
        setTimeout(() => {
            service.spray;
        }, 100);
        expect(spraySpy).not.toHaveBeenCalled();
        jasmine.clock().tick(101);
        expect(spraySpy).toHaveBeenCalled();
    });

    it('onMouseDown should not call spray if mouseDown for less than 100 ms', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service['pathData'] = [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
        ];
        service.mouseDown = true;
        service.onMouseDown(mouseEvent);
        const spraySpy = spyOn(service, 'spray').and.stub();
        setTimeout(() => {
            service.spray;
        }, 100);
        jasmine.clock().tick(99);
        expect(spraySpy).not.toHaveBeenCalled();
    });

    it(' onMouseDown should do nothing if mouseDown is false and resizeActive is true', () => {
        service.mouseDown = false;
        drawingServiceSpy.resizeActive = true;
        service.onMouseDown(mouseEvent);
        const clearPathSpy = spyOn(service, 'clearPath').and.stub();
        const spraySpy = spyOn(service, 'spray').and.stub();
        expect(spraySpy).not.toHaveBeenCalled();
        expect(clearPathSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should do nothing if mouseDown is false', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        const clearPathSpy = spyOn(service, 'clearPath').and.stub();
        const spraySpy = spyOn(service, 'spray').and.stub();

        expect(spraySpy).not.toHaveBeenCalled();
        expect(clearPathSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should do nothing if resizeActive is true false', () => {
        service.mouseDown = true;
        drawingServiceSpy.resizeActive = true;
        service.onMouseMove(mouseEvent);
        const clearPathSpy = spyOn(service, 'clearPath').and.stub();
        const spraySpy = spyOn(service, 'spray').and.stub();
        expect(spraySpy).not.toHaveBeenCalled();
        expect(clearPathSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should set mouseDownCoord to correct position', () => {
        const expectedPosition: Vec2 = { x: 65, y: 1000 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedPosition);
    });

    it(' onMouseMove should call spray if mouseDown is true ', () => {
        service.mouseDown = true;
        const spraySpy = spyOn(service, 'spray').and.stub();
        service.onMouseMove(mouseEvent);
        expect(spraySpy).toHaveBeenCalled();
    });

    it(' onMouseUp should set mouse down to false all the time', () => {
        service.mouseDown = true;
        drawingServiceSpy.resizeActive = true;
        service['pathData'] = [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
        ];
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should set mouse down to false ', () => {
        service.mouseDown = true;
        service['pathData'] = [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
        ];
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should not spray anymore', () => {
        const spraySpy = spyOn(service, 'spray').and.stub();
        service.mouseDown = true;
        service['pathData'] = [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
        ];
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
        expect(spraySpy).not.toHaveBeenCalled();
    });

    it(' randomNumber should return a random number between num1 and num2', () => {
        const num1 = 1;
        const num2 = 50;
        const randomNumberGenerated = service.getRandomNumber(num1, num2);
        expect(randomNumberGenerated).toBeLessThanOrEqual(num2);
    });

    it('spray should iterate over pathData and call arc() should be called at each iteration ', () => {
        const mockPosition: Vec2 = { x: 55, y: 55 };

        const ctxSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'strokeStyle',
            'beginPath',
            'globalCompositeOperation',
            'fill',
            'arc',
        ]);
        service['pathData'] = [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
            { x: 4, y: 5 },
            { x: 4, y: 2 },
            { x: 7, y: 100 },
        ];
        service.emissionRate = 0; // in order to ignore other calls of ctx.arc

        service.spray(ctxSpyObject, mockPosition);

        // pathData holds 5 elements and thefore spray() will iterate through it 2 times
        expect(ctxSpyObject.arc).toHaveBeenCalledTimes(5);
    });

    it('spray should iterate over emissionsNb and call arc() every time', () => {
        const mockPosition: Vec2 = { x: 50, y: 65 };

        const ctxSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'strokeStyle',
            'beginPath',
            'globalCompositeOperation',
            'fill',
            'arc',
        ]);
        service['pathData'] = []; // 0 elements in order to ignore other calls of ctx.arc
        service.emissionRate = 100; // 100 emissions / sec

        service.spray(ctxSpyObject, mockPosition);

        // spray() is called every 0.1 sec, so we expect 10 emissions
        expect(ctxSpyObject.arc).toHaveBeenCalledTimes(10);
    });
});
