import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ToolStyles } from '@app/classes/tool';
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
    const MOCK_STARTING_POINT: Vec2 = { x: 0, y: 0 };
    const MOCK_SEGMENT_ONE: Vec2[] = [
        { x: 0, y: 0 },
        { x: 1, y: 1 },
    ];
    const MOCK_ENDING_POINT: Vec2 = { x: 1, y: 1 };

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
        // tslint:disable:no-magic-numers
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
        const clearLineAndJunctionsSpy = spyOn(service, 'clearLineAndJunctions').and.stub();
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
        const clearLineAndJunctionsSpy = spyOn(service, 'clearLineAndJunctions').and.stub();
        service.onEscape();
        expect(clearLineAndJunctionsSpy).toHaveBeenCalled();
    });

    it('clearLineAndJunctions should clear currentLine', () => {
        const emptyArray: Vec2[][] = [];
        service.currentLine.push([MOCK_STARTING_POINT, MOCK_ENDING_POINT]);
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
        const mockJunctionRadius = 10;
        service.junctionsRadius.push(mockJunctionRadius);
        service.clearLineAndJunctions();
        expect(service.junctionsRadius).toEqual(emptyArray);
    });

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
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
        const currentLineSpy = spyOn(service.currentLine, 'pop').and.stub();
        service.onBackspace();
        expect(currentLineSpy).not.toHaveBeenCalled();
    });

    it('onBackspace should set startingPoint to the previous segments startingPoint if currentLine isnt empty', () => {
        const onBackspaceMock = spyOn(service, 'onBackspace').and.callFake(() => {
            if (service.currentLine.length > 0) {
                service.startingPoint = service.currentLine[service.currentLine.length - 1][0];
            }
        });
        service.startingPoint = MOCK_SEGMENT_ONE[1];
        service.currentLine = [MOCK_SEGMENT_ONE];
        onBackspaceMock();
        expect(service.startingPoint).toBe(MOCK_SEGMENT_ONE[0]);
    });

    it('onBackspace should call pop() on currentLine, segmentStyles, junctions and junctionsRadius if currentLine isnt empty', () => {
        const currentLineSpy = spyOn(service.currentLine, 'pop').and.stub();
        const segmentStylesSpy = spyOn(service.segmentStyles, 'pop').and.stub();
        const junctionsSpy = spyOn(service.junctions, 'pop').and.stub();
        const junctionsRadiusSpy = spyOn(service.junctionsRadius, 'pop').and.stub();
        const onBackspaceMock = spyOn(service, 'onBackspace').and.callFake(() => {
            if (service.currentLine.length > 0) {
                service.startingPoint = service.currentLine[service.currentLine.length - 1][0];
                service.currentLine.pop();
                service.segmentStyles.pop();
                service.junctions.pop();
                service.junctionsRadius.pop();
            }
        });
        service.currentLine.push(MOCK_SEGMENT_ONE);
        onBackspaceMock();
        expect(currentLineSpy).toHaveBeenCalled();
        expect(segmentStylesSpy).toHaveBeenCalled();
        expect(junctionsRadiusSpy).toHaveBeenCalled();
        expect(junctionsSpy).toHaveBeenCalled();
    });

    it('onBackspace should call clearcanvas, redrawCurrentLine and drawLine if currentLine isnt empty', () => {
        const redrawCurrentLineSpy = spyOn(service, 'redrawCurrentLine').and.stub();
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        service.currentLine.push(MOCK_SEGMENT_ONE);
        service.onBackspace();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(redrawCurrentLineSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('onShift should do nothing if blockOnShift is true', () => {
        const setShiftIsPressedSpy = spyOn(service, 'setShiftIsPressed').and.stub();
        service.blockOnShift = true;
        service.onShift();
        expect(setShiftIsPressedSpy).not.toHaveBeenCalled();
    });

    it('onShift should call setShiftIsPressed and add an event listener is blockOnShift is false', () => {
        const setShiftIsPressedSpy = spyOn(service, 'setShiftIsPressed').and.stub();
        const windowEventListenerSpy = spyOn(window, 'addEventListener').and.stub();
        service.onShift();
        expect(setShiftIsPressedSpy).toHaveBeenCalled();
        expect(windowEventListenerSpy).toHaveBeenCalled();
    });

    it('onShift should set blockOnShift as true if it was false', () => {
        service.blockOnShift = false;
        service.onShift();
        expect(service.blockOnShift).toBeTrue();
    });

    it('setShiftIsPressed should put shiftIsPressed to true', () => {
        service.shiftIsPressed = false;
        service.setShiftIsPressed();
        expect(service.shiftIsPressed).toBeTrue();
    });

    it(`setShiftIsPressed should call clearCanvas, redrawCurrentLine and drawLine
         if line is started and shiftAngleCalculator returns false `, () => {
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        const redrawCurrentLineSpy = spyOn(service, 'redrawCurrentLine').and.stub();
        const mockEndingPoint = { x: 5, y: 1 };
        service.isStarted = true;
        service.startingPoint = MOCK_STARTING_POINT;
        service.endPoint = mockEndingPoint;
        service.setShiftIsPressed();
        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(redrawCurrentLineSpy).toHaveBeenCalled();
    });
    it('setShiftIsPressed shouldnt call clearCanvas,redrawCurentLine and drawLine if line is started and shiftAngleCalculator return true', () => {
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        const redrawCurrentLineSpy = spyOn(service, 'redrawCurrentLine').and.stub();
        service.isStarted = true;
        service.startingPoint = MOCK_STARTING_POINT;
        service.endPoint = MOCK_ENDING_POINT;
        service.setShiftIsPressed();
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(redrawCurrentLineSpy).not.toHaveBeenCalled();
    });

    it('setShiftNonPressed should do nothing if key isnt shift', () => {
        service.shiftIsPressed = true;
        const mockKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'A',
        });
        service.setShiftNonPressed(mockKeyboardEvent);
        expect(service.shiftIsPressed).toBeTrue();
    });

    it('setShiftNonPressed should call clearCanvas, redrawCurrentLine and drawLine if isStarted is true', () => {
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        const redrawCurrentLineSpy = spyOn(service, 'redrawCurrentLine').and.stub();
        service.shiftIsPressed = true;
        service.isStarted = true;
        const mockKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'Shift',
        });
        service.setShiftNonPressed(mockKeyboardEvent);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(redrawCurrentLineSpy).toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });
    it('setShiftNonPressed shouldnt call clearCanvas, redrawCurrentLine and drawLine if isStarted is false', () => {
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        const redrawCurrentLineSpy = spyOn(service, 'redrawCurrentLine').and.stub();
        service.shiftIsPressed = true;
        service.isStarted = false;
        const mockKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'Shift',
        });
        service.setShiftNonPressed(mockKeyboardEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(redrawCurrentLineSpy).not.toHaveBeenCalled();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('pushNewJunction should add a new center to junctions and a new radius to junctionRadius', () => {
        const mockCenter: Vec2 = { x: 5, y: 5 };
        const mockRadius = 5;
        service.pushNewJunction(mockCenter, mockRadius);
        expect(service.junctions[service.junctions.length - 1]).toEqual(mockCenter);
        expect(service.junctionsRadius[service.junctionsRadius.length - 1]).toEqual(mockRadius);
    });

    it('drawJunction should do nothing if hasJunction is false', () => {
        const beginPathSpy = spyOn(drawingServiceSpy.baseCtx, 'beginPath').and.stub();
        service.hasJunction = false;
        const mockCenter: Vec2 = { x: 0, y: 0 };
        const mockRadius = 1;
        service.drawJunction(drawingServiceSpy.baseCtx, mockCenter, mockRadius);
        expect(beginPathSpy).not.toHaveBeenCalled();
    });

    it('drawJunction should call beginPath, arc, fillstyle and fill if hasJunction is true', () => {
        const beginPathSpy = spyOn(drawingServiceSpy.baseCtx, 'beginPath').and.stub();
        const arcSpy = spyOn(drawingServiceSpy.baseCtx, 'arc').and.stub();
        const fillSpy = spyOn(drawingServiceSpy.baseCtx, 'fill').and.stub();
        const mockCenter: Vec2 = { x: 0, y: 0 };
        const mockRadius = 1;
        service.hasJunction = true;
        service.drawJunction(drawingServiceSpy.baseCtx, mockCenter, mockRadius);
        expect(beginPathSpy).toHaveBeenCalled();
        expect(arcSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
        expect(drawingServiceSpy.baseCtx.fillStyle).toEqual('#000000');
    });

    it('redrawCurrentLine shouldnt call drawLine if currentLine is empty', () => {
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        service.redrawCurrentLine(service.drawingService.baseCtx);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('redrawCurrentLine should call drawLine if currentLine isnt empty', () => {
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        service.currentLine.push(MOCK_SEGMENT_ONE);
        service.redrawCurrentLine(service.drawingService.baseCtx);
        expect(drawLineSpy).toHaveBeenCalled();
    });
    it('redrawCurrentLine shouldnt call drawJunction if junctions is empty', () => {
        const drawJunctionSpy = spyOn(service, 'drawJunction').and.stub();
        service.redrawCurrentLine(service.drawingService.baseCtx);
        expect(drawJunctionSpy).not.toHaveBeenCalled();
    });

    it('redrawCurrentLine should call drawJunction if junctions isnt empty', () => {
        const drawJunctionSpy = spyOn(service, 'drawJunction').and.stub();
        const mockCenter: Vec2 = { x: 5, y: 5 };
        service.junctions.push(mockCenter);
        service.redrawCurrentLine(service.drawingService.baseCtx);
        expect(drawJunctionSpy).toHaveBeenCalled();
    });
    it('redrawCurrentLine should call clearLineAndJunctions only if ctx is baseCtx', () => {
        const clearLineAndJunctionsSpy = spyOn(service, 'clearLineAndJunctions').and.stub();
        service.redrawCurrentLine(service.drawingService.baseCtx);
        expect(clearLineAndJunctionsSpy).toHaveBeenCalled();
    });

    it('drawLine should call setColors and setStyles', () => {
        const setColorsSpy = spyOn(service, 'setColors').and.stub();
        const setStylesSpy = spyOn(service, 'setStyles').and.stub();
        service.drawLine(drawingServiceSpy.baseCtx, [MOCK_STARTING_POINT, MOCK_ENDING_POINT]);
        expect(setColorsSpy).toHaveBeenCalled();
        expect(setStylesSpy).toHaveBeenCalled();
    });

    it('drawLine should call lineTo, moveTo, beginPath and stroke', () => {
        const lineToSpy = spyOn(drawingServiceSpy.baseCtx, 'lineTo').and.stub();
        const beginPathSpy = spyOn(drawingServiceSpy.baseCtx, 'beginPath').and.stub();
        const strokeSpy = spyOn(drawingServiceSpy.baseCtx, 'stroke').and.stub();
        const mockPath: Vec2[] = [MOCK_STARTING_POINT, MOCK_ENDING_POINT];
        service.drawLine(drawingServiceSpy.baseCtx, mockPath);
        expect(lineToSpy).toHaveBeenCalled();
        expect(beginPathSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });

    it('drawLine should set drawingStarted to true only if the ctx is baseCtx', () => {
        service.drawLine(service.drawingService.baseCtx, [MOCK_STARTING_POINT, MOCK_ENDING_POINT]);
        expect(service.drawingService.drawingStarted).toBeTrue();
        service.drawingService.drawingStarted = false;
        service.drawLine(service.drawingService.previewCtx, [MOCK_STARTING_POINT, MOCK_ENDING_POINT]);
        expect(service.drawingService.drawingStarted).toBeFalse();
    });

    it(' mouseClick should set endingPosition to mouse position when the line is started and shift isnt pressed', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.startingPoint = MOCK_STARTING_POINT;
        service.isStarted = true;
        service.onMouseClick(mouseEvent);
        expect(service.endPoint).toEqual(expectedResult);
    });

    it('mouseclick should set isStarted to true if it was false', () => {
        service.isStarted = false;
        service.onMouseClick(mouseEvent);
        expect(service.isStarted).toBeTrue();
    });

    it(' mouseClick should call drawLine() when endingPoint is set', () => {
        const drawLineSpy = spyOn(service, 'drawLine').and.stub();
        service.isStarted = true;
        service.startingPoint = MOCK_STARTING_POINT;
        service.onMouseClick(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('mouseClick should set calledFromMouseClick false if shiftIsPressed is true', () => {
        service.startingPoint = MOCK_STARTING_POINT;
        service.endPoint = MOCK_ENDING_POINT;
        service.mousePosition = MOCK_ENDING_POINT;
        service.isStarted = true;
        service.calledFromMouseClick = true;
        service.shiftIsPressed = true;
        service.onMouseClick(mouseEvent);
        expect(service.calledFromMouseClick).toBeFalse();
    });

    it('mouseClick should set startingPoint as mouse position if it isnt started', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseClick(mouseEvent);
        expect(service.startingPoint).toEqual(expectedResult);
    });

    it('mouseClick should call pushNewJunction and drawJunction if it isnt started', () => {
        const pushNewJunctionSpy = spyOn(service, 'pushNewJunction').and.stub();
        const drawJunctionSpy = spyOn(service, 'drawJunction').and.stub();
        service.onMouseClick(mouseEvent);
        expect(pushNewJunctionSpy).toHaveBeenCalled();
        expect(drawJunctionSpy).toHaveBeenCalled();
    });

    it('mouseMove should do nothing if isStarted is false', () => {
        service.isStarted = false;
        const getPositionSpy = spyOn(service, 'getPositionFromMouse').and.stub();
        service.onMouseMove(mouseEvent);
        expect(getPositionSpy).not.toHaveBeenCalled();
    });
    it(' mouseMove should set endPosition to current mouse position when called', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.startingPoint = MOCK_STARTING_POINT;
        service.isStarted = true;
        service.onMouseMove(mouseEvent);
        expect(service.endPoint).toEqual(expectedResult);
    });

    it('onMouseMove should set angledEndPoint and endPoint to what closestAngledPoint returns if shiftIsPressed is true', () => {
        service.startingPoint = MOCK_STARTING_POINT;
        service.shiftIsPressed = true;
        service.isStarted = true;
        mouseEvent = {
            offsetX: 5,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        const mockEndingPoint = { x: mouseEvent.offsetX, y: mouseEvent.offsetY };
        const expectedResult = service.lineHelper.closestAngledPoint(MOCK_STARTING_POINT, mockEndingPoint);
        service.onMouseMove(mouseEvent);
        expect(service.endPoint).toEqual(expectedResult);
        expect(service.angledEndPoint).toEqual(expectedResult);
    });

    it('onDoubleClick should set the endPoint as the starting point of the line if the click is done < 20px from the original point', () => {
        service.isStarted = true;
        const MOCK_STARTING_POINT = { x: 15, y: 15 };
        const mockEndingPointSegmentOne = { x: 20, y: 20 };
        service.currentLine.push([MOCK_STARTING_POINT, mockEndingPointSegmentOne]);
        service.startingPoint = mockEndingPointSegmentOne;
        service.onDoubleClick(mouseEvent);
        expect(service.endPoint).toEqual(MOCK_STARTING_POINT);
    });

    it('onDoubleClick should set endPoint as mouse position if shift isnt pressed', () => {
        service.isStarted = true;
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.currentLine.push([MOCK_STARTING_POINT, MOCK_ENDING_POINT]);
        service.startingPoint = MOCK_ENDING_POINT;
        service.onDoubleClick(mouseEvent);
        expect(service.endPoint).toEqual(expectedResult);
    });

    it('onDoubleClick should set endPoint as angledEndPoint if shift if pressed', () => {
        service.shiftIsPressed = true;
        service.isStarted = true;
        service.angledEndPoint = { x: 5, y: 5 };
        const expectedResult: Vec2 = { x: 5, y: 5 };
        service.currentLine.push([MOCK_STARTING_POINT, MOCK_ENDING_POINT]);
        service.startingPoint = MOCK_ENDING_POINT;
        service.onDoubleClick(mouseEvent);
        expect(service.endPoint).toEqual(expectedResult);
    });
});
