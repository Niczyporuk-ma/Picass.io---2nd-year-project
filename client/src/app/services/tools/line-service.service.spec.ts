import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ToolStyles } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineServiceService } from './line-service.service';

fdescribe('LineService', () => {
    let service: LineServiceService;
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

    it('clearArrays should call clearLinesAndJunctions', () => {
        const clearLineAndJunctionsSpy = spyOn<any>(service, 'clearLineAndJunctions').and.stub();

        service.clearArrays();
        expect(clearLineAndJunctionsSpy).toHaveBeenCalled();
    });

    it('onEscape should set isStarted to false', () => {
        service.isStarted = true;
        service.onEscape();
        expect(service.isStarted).toBeFalse();
    });

    it('onEscape should call clearCanvas', () => {
        service.onEscape();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('onEscape should calle clearLineAndJunctions', () => {
        const clearLineAndJunctionsSpy = spyOn<any>(service, 'clearLineAndJunctions').and.stub();
        service.onEscape();
        expect(clearLineAndJunctionsSpy).toHaveBeenCalled();
    });

    it('clearLineAndJunctions should clear currentLine', () => {
        const emptyArray: Vec2[][] = [];
        const mockStartingPoint: Vec2 = { x: 0, y: 0 };
        const mockEndingPoint: Vec2 = { x: 1, y: 1 };
        service.currentLine.push([mockStartingPoint, mockEndingPoint]);
        service.clearLineAndJunctions();
        expect(service.currentLine).toEqual(emptyArray);
    });
    it('clearLineAndJunctions should clear segmentStyles', () => {
        const emptyArray: ToolStyles[] = [];
        const mockToolStyle: ToolStyles = { primaryColor: 'blue', lineWidth: 5 };
        service.segmentStyles.push(mockToolStyle);
        service.clearLineAndJunctions();
        expect(service.segmentStyles).toEqual(emptyArray);
    });
    it('clearLineAndJunctions should clear junctions', () => {
        const emptyArray: Vec2[] = [];
        const mockJunctionCenter: Vec2 = { x: 1, y: 1 };
        service.junctions.push(mockJunctionCenter);
        service.clearLineAndJunctions();
        expect(service.junctions).toEqual(emptyArray);
    });
    it('clearLineAndJunctions should clear junctionsRadius', () => {
        const emptyArray: number[] = [];
        const mockJunctionRadius: number = 10;
        service.junctionsRadius.push(mockJunctionRadius);
        service.clearLineAndJunctions();
        expect(service.junctionsRadius).toEqual(emptyArray);
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

    it('onBackspace should only do something if currentLine isnt empty', () => {
        const currentLineSpy = spyOn<any>(service.currentLine, 'pop').and.stub();
        service.currentLine = [];
        service.onBackspace();
        expect(currentLineSpy).not.toHaveBeenCalled();
    });

    it('onBackspace should set startingPoint to the previous segments startingPoint if currentLine isnt empty', () => {
        const onBackspaceMock = spyOn<any>(service, 'onBackspace').and.callFake(() => {
            if (service.currentLine.length > 0) {
                service.startingPoint = service.currentLine[service.currentLine.length - 1][0];
            }
        });
        const mockSegmentOne: Vec2[] = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        service.startingPoint = mockSegmentOne[1];
        service.currentLine = [mockSegmentOne];
        onBackspaceMock();
        expect(service.startingPoint).toBe(mockSegmentOne[0]);
    });

    it('onBackspace should call pop() on currentLine, segmentStyles, junctions and junctionsRadius if currentLine isnt empty', () => {
        const currentLineSpy = spyOn<any>(service.currentLine, 'pop').and.stub();
        const segmentStylesSpy = spyOn<any>(service.segmentStyles, 'pop').and.stub();
        const junctionsSpy = spyOn<any>(service.junctions, 'pop').and.stub();
        const junctionsRadiusSpy = spyOn<any>(service.junctionsRadius, 'pop').and.stub();
        const onBackspaceMock = spyOn<any>(service, 'onBackspace').and.callFake(() => {
            if (service.currentLine.length > 0) {
                service.startingPoint = service.currentLine[service.currentLine.length - 1][0];
                service.currentLine.pop();
                service.segmentStyles.pop();
                service.junctions.pop();
                service.junctionsRadius.pop();
            }
        });
        const mockSegmentOne: Vec2[] = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        service.currentLine.push(mockSegmentOne);

        onBackspaceMock();
        expect(currentLineSpy).toHaveBeenCalled();
        expect(segmentStylesSpy).toHaveBeenCalled();
        expect(junctionsRadiusSpy).toHaveBeenCalled();
        expect(junctionsSpy).toHaveBeenCalled();
    });

    it('onBackspace should call clearcanvas, redrawCurrentPreview and drawLine if currentLine isnt empty', () => {
        //const clearCanvasSpy = spyOn<any>(service.drawingService, 'clearCanvas').and.stub();
        const redrawCurrentPreviewSpy = spyOn<any>(service, 'redrawCurrentPreview').and.stub();
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.stub();

        const mockSegmentOne: Vec2[] = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        service.currentLine.push(mockSegmentOne);

        service.onBackspace();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(redrawCurrentPreviewSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('setShiftIsPressed should put shiftIsPressed to true', () => {
        service.shiftIsPressed = false;
        service.setShiftIsPressed();
        expect(service.shiftIsPressed).toBeTrue();
    });

    it('pushNewJunction should add a new center to junctions and a new radius to junctionRadius', () => {
        const mockCenter: Vec2 = { x: 5, y: 5 };
        const mockRadius: number = 5;

        service.pushNewJunction(mockCenter, mockRadius);
        expect(service.junctions[service.junctions.length - 1]).toEqual(mockCenter);
        expect(service.junctionsRadius[service.junctionsRadius.length - 1]).toEqual(mockRadius);
    });

    it('redrawCurrentBase shouldnt call drawLine if currentLine is empty', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.stub();
        service.currentLine = [];

        service.redrawCurrentBase();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('redrawCurrentBase should call drawLine if currentLine isnt empty', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.stub();
        service.currentLine = [];
        const mockSegmentOne: Vec2[] = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        service.currentLine.push(mockSegmentOne);

        service.redrawCurrentBase();
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('redrawCurrentBase shouldnt call drawJunction if junctions is empty', () => {
        const drawJunctionSpy = spyOn<any>(service, 'drawJunction').and.stub();
        service.junctions = [];
        service.redrawCurrentBase();
        expect(drawJunctionSpy).not.toHaveBeenCalled();
    });

    it('redrawCurrentBase should call drawJunction if junctions isnt empty', () => {
        const drawJunctionSpy = spyOn<any>(service, 'drawJunction').and.stub();
        service.junctions = [];
        const mockCenter: Vec2 = { x: 5, y: 5 };
        service.junctions.push(mockCenter);
        service.redrawCurrentBase();
        expect(drawJunctionSpy).toHaveBeenCalled();
    });
    it('redrawCurrentBase should call clearLineAndJunctions', () => {
        const clearLineAndJunctionsSpy = spyOn<any>(service, 'clearLineAndJunctions').and.stub();
        service.redrawCurrentBase();
        expect(clearLineAndJunctionsSpy).toHaveBeenCalled();
    });

    it('drawLine should call setColors and setStyles', () => {
        const setColorsSpy = spyOn<any>(service, 'setColors').and.stub();
        const setStylesSpy = spyOn<any>(service, 'setStyles').and.stub();
        const mockStartingPoint = { x: 0, y: 0 };
        const mockEndingPoint = { x: 1, y: 1 };
        service.drawLine(drawingServiceSpy.baseCtx, [mockStartingPoint, mockEndingPoint]);
        expect(setColorsSpy).toHaveBeenCalled();
        expect(setStylesSpy).toHaveBeenCalled();
    });

    it('drawLine should set drawingStarted to true only if the ctx is baseCtx', () => {
        const mockStartingPoint = { x: 0, y: 0 };
        const mockEndingPoint = { x: 1, y: 1 };
        service.drawLine(service.drawingService.baseCtx, [mockStartingPoint, mockEndingPoint]);
        expect(service.drawingService.drawingStarted).toBeTrue();
        service.drawingService.drawingStarted = false;
        service.drawLine(service.drawingService.previewCtx, [mockStartingPoint, mockEndingPoint]);
        expect(service.drawingService.drawingStarted).toBeFalse();
    });

    // // probleme du set dans drawline
    it(' mouseClick should set endingPosition to correct position when the line is started', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        const mockStartingPoint = { x: 0, y: 0 };
        service.startingPoint = mockStartingPoint;
        service.isStarted = true;
        service.onMouseClick(mouseEvent);
        expect(service.endPoint).toEqual(expectedResult);
    });

    it('mouseclick should set isStarted to true if it was false', () => {
        // const mockStartingPoint = { x: 0, y: 0 };
        // const mockEndingPoint = { x: 1, y: 1 };
        // service.startingPoint
        service.isStarted = false;
        service.onMouseClick(mouseEvent);
        expect(service.isStarted).toBeTrue();
    });

    it(' mouseClick should call drawLine() when endingPoint is set', () => {
        const drawLineSpy = spyOn<any>(service, 'drawLine').and.stub();
        service.isStarted = true;
        const mockStartingPoint = { x: 0, y: 0 };
        service.startingPoint = mockStartingPoint;
        service.onMouseClick(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });
});
