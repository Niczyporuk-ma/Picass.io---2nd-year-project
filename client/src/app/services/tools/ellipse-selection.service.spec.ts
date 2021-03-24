import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ABHKAxis, EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';

describe('EllipseSelectionService', () => {
    let service: EllipseSelectionService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let mockStartingPoint: Vec2;
    let mockEndingPoint: Vec2;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'clearBackground']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service = TestBed.inject(EllipseSelectionService);

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        // tslint:disable:no-magic-numbers
        // tslint:disable:max-file-line-count

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;

        mockStartingPoint = { x: -50, y: -50 };
        mockEndingPoint = { x: 1, y: 1 };

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

    it(' mouseDown should call disableUndoRedo', () => {
        service.mouseDown = false;
        const disableUndoRedoSpy = spyOn(service.undoRedoManager, 'disableUndoRedo');
        service.onMouseDown(mouseEvent);
        expect(disableUndoRedoSpy).toHaveBeenCalled();
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it('mouseDown should call getABHKXaxis if currentline length > 0', () => {
        const getABHKXaxisSpy = spyOn(service, 'getABHKXaxis').and.callThrough();
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.onMouseDown(mouseEvent);
        expect(getABHKXaxisSpy).toHaveBeenCalled();
    });

    it('mouseDown shouldnt call getABHKXaxis if currentline length <= 0', () => {
        const getABHKXaxisSpy = spyOn(service, 'getABHKXaxis').and.stub();
        service.currentLine = [];
        service.onMouseDown(mouseEvent);
        expect(getABHKXaxisSpy).not.toHaveBeenCalled();
    });

    it('mouseDown should call resetState and set isMovingImg as false if checkIfInsideEllipse returns false', () => {
        const resetStateSpy = spyOn(service, 'resetState').and.stub();
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.isMovingImg = true;
        service.onMouseDown(mouseEvent);
        expect(resetStateSpy).toHaveBeenCalled();
        expect(service.isMovingImg).toBeFalse();
    });

    it('mouseDown shouldnt call resetState if checkIfInsideEllipse returns true', () => {
        const resetStateSpy = spyOn(service, 'resetState').and.stub();
        mockEndingPoint = { x: 30, y: 30 };
        service.startingPoint = mockStartingPoint;
        service.endPoint = mockEndingPoint;
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            button: 0,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(resetStateSpy).not.toHaveBeenCalled();
    });

    it('mouseDown should call getImageData if currentlySelecting is false', () => {
        const getImageDataSpy = spyOn(service, 'getImageData').and.callThrough();
        service.currentlySelecting = false;
        mockEndingPoint = { x: 30, y: 30 };
        service.startingPoint = mockStartingPoint;
        service.endPoint = mockEndingPoint;
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            button: 0,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(getImageDataSpy).toHaveBeenCalled();
    });

    it('mouseDown shouldnt call getImageData if currentlySelecting is true', () => {
        const getImageDataSpy = spyOn(service, 'getImageData').and.callThrough();
        service.currentlySelecting = true;
        mockEndingPoint = { x: 30, y: 30 };
        service.startingPoint = mockStartingPoint;
        service.endPoint = mockEndingPoint;
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            button: 0,
        } as MouseEvent;
        service.imageData = new ImageData(100, 100);
        service.onMouseDown(mouseEvent);
        expect(getImageDataSpy).not.toHaveBeenCalled();
    });

    it(`mouseDown should call fixImageData, set isMovingImg as true and call getPositionFromMouse
      if currentLine length > 0 & click is inside ellipse`, () => {
        const fixImageDataSpy = spyOn(service, 'fixImageData').and.stub();
        service.isMovingImg = false;
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.stub();

        service.currentlySelecting = true;
        mockEndingPoint = { x: 30, y: 30 };
        service.startingPoint = mockStartingPoint;
        service.endPoint = mockEndingPoint;
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        mouseEvent = {
            offsetX: 0,
            offsetY: 0,
            button: 0,
        } as MouseEvent;
        service.imageData = new ImageData(100, 100);

        service.onMouseDown(mouseEvent);

        expect(fixImageDataSpy).toHaveBeenCalled();
        expect(service.isMovingImg).toBeTrue();
        expect(getPositionFromMouseSpy).toHaveBeenCalled();
    });

    it('mouseDown should set isMovingImg as false if currentLine length <= 0', () => {
        service.isMovingImg = true;
        service.onMouseDown(mouseEvent);
        expect(service.isMovingImg).toBeFalse();
    });

    it('mouseDown should set mouseDownCoord as the position of the mouseDownEvent', () => {
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(service.getPositionFromMouse(mouseEvent));
    });

    it('setShiftIsPressed does nothing if the key isnt shift', () => {
        const wrongEvent = new KeyboardEvent('keydown', { key: 'A' });
        service.shiftIsPressed = false;
        service.setShiftIsPressed(wrongEvent);
        expect(service.shiftIsPressed).toBeFalse();
    });

    it('setShiftPressed should have called both drawEllipse and drawRectangle if checkIsSquare returns false and mouseDown is true', () => {
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service.mouseDown = true;
        service['startingPoint'] = { x: 1, y: 5 };
        service['endPoint'] = { x: 5, y: 5 };

        service.setShiftIsPressed(event);
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

        service.setShiftIsPressed(event);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it('setShiftNonPressed sets shiftIsPressed false', () => {
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.mouseDown = false;
        const event = new KeyboardEvent('keydown', { key: 'Shift' });
        service.setShiftNonPressed(event);
        expect(service.shiftIsPressed).toEqual(false);
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

    it('setShiftNonPressed does nothing if key isnt Shift', () => {
        const event = new KeyboardEvent('keydown', { key: 'A' });
        service.shiftIsPressed = true;
        service.setShiftNonPressed(event);
        expect(service.shiftIsPressed).toBeTrue();
    });

    it('getImageData should call baseCtx.getImageData twice, drawEllipse once and set currentlySelecting as true', () => {
        const getImageDataSpy = spyOn(service.drawingService.baseCtx, 'getImageData').and.stub();
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();

        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.currentlySelecting = false;
        service.getImageData();
        expect(getImageDataSpy).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
        expect(service.currentlySelecting).toBeTrue();
    });

    it('cleanImageData should call getABHKXaxis', () => {
        const getABHKXaxisSpy = spyOn(service, 'getABHKXaxis').and.callThrough();
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.imageData = new ImageData(100, 100);
        service.cleanImgData();
        expect(getABHKXaxisSpy).toHaveBeenCalled();
    });

    it('cleanImageData should call checkIfInsideEllipse for every pixel', () => {
        const checkIfInsideEllipseSpy = spyOn(service, 'checkIfInsideEllipse').and.stub();
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.imageData = new ImageData(100, 100);
        service.cleanImgData();
        expect(checkIfInsideEllipseSpy).toHaveBeenCalledTimes(10000);
    });

    it('checkIfInsideEllipse should inverse the A and B parameters if Xaxis is false', () => {
        const parameters: ABHKAxis = { A: 2, B: 3, H: 4, K: 5, xAxis: false };
        service.checkIfInsideEllipse(parameters, 1, 1);
        expect(parameters.A).toEqual(3);
        expect(parameters.B).toEqual(2);
    });

    it('checkIfInsideEllipse shouldnt inverse the A and B parameters if Xaxis is true', () => {
        const parameters: ABHKAxis = { A: 2, B: 3, H: 4, K: 5, xAxis: true };
        service.checkIfInsideEllipse(parameters, 1, 1);
        expect(parameters.A).toEqual(2);
        expect(parameters.B).toEqual(3);
    });

    it('checkIfInsideEllipse should return true if the point is inside it', () => {
        const parameters: ABHKAxis = { A: 2, B: 3, H: 0, K: 0, xAxis: false };
        expect(service.checkIfInsideEllipse(parameters, 0, 0)).toBeTrue();
    });

    it('checkIfInsideEllipse should return false if the point isnt inside it', () => {
        const parameters: ABHKAxis = { A: 2, B: 3, H: 0, K: 0, xAxis: false };
        expect(service.checkIfInsideEllipse(parameters, 3, 5)).toBeFalse();
    });

    it('moveImageData should call clearCanvas twice', () => {
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.lastPos = { x: 0, y: 0 };
        service.imageData = new ImageData(100, 100);
        service.backgroundImageData = new ImageData(100, 100);
        service.moveImageData(1, 1);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalledTimes(2);
    });

    it('moveImageData should correctly set currentLine', () => {
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.lastPos = { x: 0, y: 0 };
        service.imageData = new ImageData(100, 100);
        service.backgroundImageData = new ImageData(100, 100);
        service.moveImageData(1, 1);

        expect(service.currentLine).toEqual([
            { x: -49, y: -49 },
            { x: 2, y: 2 },
        ]);
    });

    it('moveImageData should correctly set lastPos', () => {
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.lastPos = { x: 0, y: 0 };
        service.imageData = new ImageData(100, 100);
        service.backgroundImageData = new ImageData(100, 100);
        service.moveImageData(1, 1);

        expect(service.lastPos).toEqual({ x: 1, y: 1 });
    });

    it(`moveImageData should call drawRectangle, drawAnchorPoints, drawEllipse
  ,fixImageData and putImageData twice`, () => {
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        const drawAnchorPointsSpy = spyOn(service, 'drawAnchorPoints').and.stub();
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        const fixImageDataSpy = spyOn(service, 'fixImageData').and.stub();
        const putImageDataSpy = spyOn(baseCtxStub, 'putImageData').and.stub();
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.lastPos = { x: 0, y: 0 };
        service.imageData = new ImageData(100, 100);
        service.backgroundImageData = new ImageData(100, 100);
        service.moveImageData(1, 1);

        expect(drawAnchorPointsSpy).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
        expect(putImageDataSpy).toHaveBeenCalledTimes(2);
        expect(fixImageDataSpy).toHaveBeenCalled();
    });

    it('onMouseUp should do nothing if mouseDown is false or resizeActive is true', () => {
        service.mouseDown = false;
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
        service.mouseDown = true;
        service.drawingService.resizeActive = true;
        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' mouseUp should call enableUndoRedo', () => {
        service.mouseDown = true;
        service['drawingService'].resizeActive = false;
        const enableUndoRedoSpy = spyOn(service.undoRedoManager, 'enableUndoRedo');
        service.mouseDownCoord = { x: 0, y: 0 };
        service.startingPoint = mockStartingPoint;
        service.endPoint = mockEndingPoint;
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.imageData = new ImageData(100, 100);
        service.backgroundImageData = new ImageData(100, 100);
        service.onMouseUp(mouseEvent);
        expect(enableUndoRedoSpy).toHaveBeenCalled();
    });

    it('onMouseUp should set mouseDown as false if it was true', () => {
        service.mouseDown = true;
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        service.mouseDownCoord = { x: 0, y: 0 };
        service.startingPoint = mockStartingPoint;
        service.endPoint = mockEndingPoint;
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it('onMouseUp should set hasBeenReseted as false if it was true and return', () => {
        service.mouseDown = true;
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        service.hasBeenReseted = true;
        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should call fixImageData and putImageData and return if isMovingImg is true', () => {
        service.mouseDown = true;
        const fixCurrentLineSpy = spyOn(service, 'fixCurrentLine').and.callThrough();
        const fixImageDataSpy = spyOn(service, 'fixImageData').and.stub();
        const putImageDataSpy = spyOn(baseCtxStub, 'putImageData').and.stub();
        service.currentlySelecting = true;
        service.isMovingImg = true;
        service.imageData = new ImageData(100, 100);
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.onMouseUp(mouseEvent);
        expect(fixImageDataSpy).toHaveBeenCalled();
        expect(putImageDataSpy).toHaveBeenCalled();
        expect(fixCurrentLineSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set endPoint as mousePosition if shiftIsPressed is false', () => {
        service.mouseDown = true;
        service.imageData = new ImageData(100, 100);
        service.startingPoint = mockStartingPoint;
        service.endPoint = mockEndingPoint;
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.onMouseUp(mouseEvent);
        expect(service.endPoint).toEqual(service.getPositionFromMouse(mouseEvent));
    });

    it(`onMouseUp should call clearCanvas, fixCurrentLine, drawRectangle, 
    drawAnchorPoint and drawEllipse`, () => {
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        const drawAnchorPointsSpy = spyOn(service, 'drawAnchorPoints').and.stub();
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        const fixCurrentLineSpy = spyOn(service, 'fixCurrentLine').and.callThrough();
        service.mouseDown = true;
        service.currentlySelecting = true;
        service.shiftIsPressed = true;
        service.currentLine = [
            { x: 10, y: 10 },
            { x: 5, y: 5 },
        ];
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
        expect(drawAnchorPointsSpy).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
        expect(fixCurrentLineSpy).toHaveBeenCalled();
    });

    it('onMouseUp shouldnt call getPositionFromMouse if shiftIsPressed is true', () => {
        service.mouseDown = true;
        service.shiftIsPressed = true;
        service.startingPoint = mockStartingPoint;
        service.endPoint = mockEndingPoint;
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse').and.stub();
        service.onMouseUp(mouseEvent);
        expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
    });

    it('onShift sets isShiftPressed true', () => {
        service.shiftIsPressed = false;
        service.onShift();
        expect(service.shiftIsPressed).toEqual(true);
    });

    it('onShift doesnt add event listeners if isShiftPressed is true', () => {
        service.shiftIsPressed = true;
        const eventListenerSpy = spyOn(window, 'addEventListener').and.stub();
        service.onShift();
        expect(eventListenerSpy).not.toHaveBeenCalled();
    });

    it('getABHKXaxis should return the right values', () => {
        let mockCurrentLine: Vec2[] = [mockStartingPoint, mockEndingPoint];
        service.currentLine = mockCurrentLine;
        let expectedResult: ABHKAxis = { A: 25.5, B: 25.5, H: -24.5, K: -24.5, xAxis: false };
        expect(service.getABHKXaxis()).toEqual(expectedResult);

        mockCurrentLine = [
            { x: 10, y: 0 },
            { x: 15, y: 0 },
        ];
        service.currentLine = mockCurrentLine;
        expectedResult = { A: 2.5, B: 0, H: 12.5, K: 0, xAxis: true };
        expect(service.getABHKXaxis()).toEqual(expectedResult);
    });

    it('fixImageData should call checkIfInsideEllipse for every pixel in the currentLine selection', () => {
        const checkIfInsideEllipseSpy = spyOn(service, 'checkIfInsideEllipse').and.stub();
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.imageData = new ImageData(100, 100);
        const numberOfTimes: number = -51 * -51;
        service.fixImageData();
        expect(checkIfInsideEllipseSpy).toHaveBeenCalledTimes(numberOfTimes);
    });

    it('fixImageData should call getABHKXaxis', () => {
        const getABHKXaxisSpy = spyOn(service, 'getABHKXaxis').and.callThrough();
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.imageData = new ImageData(100, 100);
        service.fixImageData();
        expect(getABHKXaxisSpy).toHaveBeenCalled();
    });

    it(`onMouseMove should do nothing if mouseDown is false or resizeActive is true or hasBeenReseted is true`, () => {
        service.mouseDown = false;
        drawServiceSpy.resizeActive = false;
        service.hasBeenReseted = false;
        service.isMovingImg = false;
        const getPositionFromMouseSpy = spyOn(service, 'getPositionFromMouse');
        service.onMouseMove(mouseEvent);
        expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
        service.mouseDown = true;
        drawServiceSpy.resizeActive = true;
        service.onMouseMove(mouseEvent);
        expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
        drawServiceSpy.resizeActive = false;
        service.hasBeenReseted = true;
        service.onMouseMove(mouseEvent);
        expect(getPositionFromMouseSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call moveImageData if mouseDown is true and isMovingImg is true', () => {
        service.mouseDown = true;
        service.isMovingImg = true;
        const moveImageDataSpy = spyOn(service, 'moveImageData').and.stub();
        service.onMouseMove(mouseEvent);
        expect(moveImageDataSpy).toHaveBeenCalled();
    });

    it('onMouseMove shouldnt call moveImageData if mouseDown is true and isMovingImg is false', () => {
        service.mouseDown = true;
        service.isMovingImg = false;
        const moveImageDataSpy = spyOn(service, 'moveImageData').and.stub();
        service.startingPoint = mockStartingPoint;
        service.endPoint = mockEndingPoint;
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.onMouseMove(mouseEvent);
        expect(moveImageDataSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call closestSquare if shiftIsPressed is true', () => {
        service.mouseDown = true;
        service.shiftIsPressed = true;
        const closestSquareSpy = spyOn(service.squareHelperService, 'closestSquare').and.callThrough();
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.onMouseMove(mouseEvent);
        expect(closestSquareSpy).toHaveBeenCalled();
    });

    it('onMouseMove should call clearCanvas, drawRectangle and drawEllipse if isMovingImg is false', () => {
        service.mouseDown = true;
        service.isMovingImg = false;
        const drawRectangleSpy = spyOn(service, 'drawRectangle').and.stub();
        const drawEllipseSpy = spyOn(service, 'drawEllipse').and.stub();
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('drawAnchorPoints should call beginPath,fill and arc 8 times', () => {
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.anchorPoints = [];
        const beginPathSpy = spyOn(drawServiceSpy.baseCtx, 'beginPath').and.stub();
        const fillSpy = spyOn(drawServiceSpy.baseCtx, 'fill').and.stub();
        const arcSpy = spyOn(drawServiceSpy.baseCtx, 'arc').and.stub();
        service.drawAnchorPoints(drawServiceSpy.baseCtx, service.currentLine);
        expect(beginPathSpy).toHaveBeenCalledTimes(8);
        expect(fillSpy).toHaveBeenCalledTimes(8);
        expect(arcSpy).toHaveBeenCalledTimes(8);
    });

    it('drawAnchorPoints should correctly set the anchorPoints', () => {
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.anchorPoints = [];
        const expectedResult: Vec2[] = [
            mockStartingPoint,
            { x: -24.5, y: mockStartingPoint.y },
            { x: mockEndingPoint.x, y: mockStartingPoint.y },
            { x: mockEndingPoint.x, y: -24.5 },
            mockEndingPoint,
            { x: -24.5, y: mockEndingPoint.y },
            { x: mockStartingPoint.x, y: mockEndingPoint.y },
            { x: mockStartingPoint.x, y: -24.5 },
        ];
        service.drawAnchorPoints(drawServiceSpy.baseCtx, service.currentLine);
        expect(service.anchorPoints).toEqual(expectedResult);
    });

    it('drawRectangle should call strokeRect and closePath', () => {
        const strokeRectSpy = spyOn(drawServiceSpy.baseCtx, 'strokeRect').and.stub();
        const closePathSpy = spyOn(drawServiceSpy.baseCtx, 'closePath').and.stub();
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.drawRectangle(drawServiceSpy.baseCtx, service.currentLine);
        expect(closePathSpy).toHaveBeenCalled();
        expect(strokeRectSpy).toHaveBeenCalled();
    });

    it('drawEllipse should call arc if shiftIsPressed is true', () => {
        service.shiftIsPressed = true;
        const arcSpy = spyOn(drawServiceSpy.baseCtx, 'arc').and.stub();
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.drawEllipse(drawServiceSpy.baseCtx, mockStartingPoint, mockEndingPoint, false);
        expect(arcSpy).toHaveBeenCalled();
    });
    it('drawEllipse should call ellipse if shiftIsPressed is false', () => {
        service.shiftIsPressed = false;
        const ellipseSpy = spyOn(drawServiceSpy.baseCtx, 'ellipse').and.stub();
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.drawEllipse(drawServiceSpy.baseCtx, mockStartingPoint, mockEndingPoint, false);
        expect(ellipseSpy).toHaveBeenCalled();
    });

    it('drawEllipse should call fill if erase is true', () => {
        service.shiftIsPressed = false;
        const fillSpy = spyOn(drawServiceSpy.baseCtx, 'fill').and.stub();
        service.startingPoint = { x: 0, y: 0 };
        service.endPoint = { x: 1, y: 1 };
        service.currentLine = [mockStartingPoint, mockEndingPoint];
        service.drawEllipse(drawServiceSpy.baseCtx, mockStartingPoint, mockEndingPoint, true);
        expect(fillSpy).toHaveBeenCalled();
    });

    it(`move functions should correctly set the offset`, () => {
        service.lastPos = { x: 0, y: 0 };
        service.currentLine = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        service.offsetYModifier = 0;
        service.offsetXModifier = 0;
        service.imageData = new ImageData(100, 100);
        service.backgroundImageData = new ImageData(100, 100);
        const waitTimerSpy = spyOn(service, 'waitTimer').and.stub();

        service.moveUp();
        expect(service.offsetYModifier).toEqual(-3);

        service.moveDown();
        expect(service.offsetYModifier).toEqual(0);

        service.moveLeft();
        expect(service.offsetXModifier).toEqual(-3);

        service.moveRight();
        expect(service.offsetXModifier).toEqual(0);

        expect(waitTimerSpy).toHaveBeenCalledTimes(4);
    });

    it('arrow keys detection shouldnt be executed twice if there wasnt a keyup event', () => {
        service.lastPos = { x: 0, y: 0 };
        service.currentLine = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        service.offsetYModifier = 0;
        service.offsetXModifier = 0;
        service.imageData = new ImageData(100, 100);
        service.backgroundImageData = new ImageData(100, 100);

        service.moveUp();
        service.moveUp();
        expect(service.offsetYModifier).toEqual(-3);

        service.moveDown();
        service.moveDown();
        expect(service.offsetYModifier).toEqual(0);

        service.moveLeft();
        service.moveLeft();
        expect(service.offsetXModifier).toEqual(-3);

        service.moveRight();
        service.moveRight();
        expect(service.offsetXModifier).toEqual(0);
    });
});
