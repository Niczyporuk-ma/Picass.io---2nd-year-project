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
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']); //un genre de proxy

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

    it(' checkIfIsSquare should return true', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 5, y: 1 };
        let expected: boolean = service.checkIfIsSquare([initialCoord, endingCoord]);
        expect(expected).toEqual(true);
    });

    it(' checkIfIsSquare should not detect a square', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 14, y: 20 };
        let expected: boolean = service.checkIfIsSquare([initialCoord, endingCoord]);
        expect(expected).not.toEqual(true);
    });

    it(' checkIfIsSquare detect a square when its a single point', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 1, y: 5 };
        let expected: boolean = service.checkIfIsSquare([initialCoord, endingCoord]);
        expect(expected).toEqual(true);
    });

    it(' closestSquare should find the closest square when the horizontal distance is the longest and when isLeft is false', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 6, y: 2 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 4, y: 2 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should find the closest square when the horizontal distance is the longest and when isLeft is true', () => {
        let initialCoord: Vec2 = { x: 25, y: 20 };
        let endingCoord: Vec2 = { x: 10, y: 10 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 15, y: 10 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should find the closest square when the vertical distance is the longest and when isDownWard is true', () => {
        let initialCoord: Vec2 = { x: 1, y: 5 };
        let endingCoord: Vec2 = { x: 2, y: 2 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 2, y: 4 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should find the closest square when the vertical distance is the longest and when isDownWard is false', () => {
        let initialCoord: Vec2 = { x: 20, y: 20 };
        let endingCoord: Vec2 = { x: 25, y: 40 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 25, y: 25 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should return the initial point when the two point are on a horizontal line', () => {
        let initialCoord: Vec2 = { x: 20, y: 40 };
        let endingCoord: Vec2 = { x: 25, y: 40 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 20, y: 40 };
        expect(expectedPosition).toEqual(newPosition);
    });

    it(' closestSquare should return the initial point when the two point are on a vertical line', () => {
        let initialCoord: Vec2 = { x: 20, y: 99 };
        let endingCoord: Vec2 = { x: 20, y: 40 };
        let expectedPosition: Vec2 = service.closestSquare([initialCoord, endingCoord]);
        let newPosition: Vec2 = { x: 20, y: 99 };
        expect(expectedPosition).toEqual(newPosition);
    });
});
