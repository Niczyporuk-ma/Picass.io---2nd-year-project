import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/enums/enums';
import { PolygonService } from './polygon.service';

fdescribe('PolygonService', () => {
    let service: PolygonService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PolygonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set the startingPoint when mouseDown is true', () => {
        let mouseEvent: MouseEvent = { button: MouseButton.Left, offsetX: 0, offsetY: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service.startingPoint).toEqual({ x: 0, y: 0 });
    });

    it('onMouseDown should not call getPositionFromMouse if mouseDown is false', () => {
        let mouseEvent: MouseEvent = { button: MouseButton.Right } as MouseEvent;
        const getMouseFromPositionSpy = spyOn(service, 'getPositionFromMouse');
        service.onMouseDown(mouseEvent);
        expect(getMouseFromPositionSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set the endPoint when mouseDown is true', () => {
        spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        spyOn(service, 'drawLine').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = true;
        service['drawingService'].resizeActive = false;
        service.onMouseUp(mouseEvent);
        expect(service.endPoint).toEqual({ x: 120, y: 14 });
    });

    it('onMouseUp should call drawLine et clearCanvas when mouseDown is true', () => {
        const clearCanavsSpy = spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        const drawLineSpy = spyOn(service, 'drawLine').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = true;
        service['drawingService'].resizeActive = false;
        service.onMouseUp(mouseEvent);
        expect(clearCanavsSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('onMouseUp should notcall drawLine et clearCanvas when mouseDown is false', () => {
        const clearCanavsSpy = spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        const drawLineSpy = spyOn(service, 'drawLine').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = false;
        service['drawingService'].resizeActive = false;
        service.onMouseUp(mouseEvent);
        expect(clearCanavsSpy).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should always set mouseDown to false', () => {
        spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        spyOn(service, 'drawLine').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = true;
        service['drawingService'].resizeActive = false;
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

   
    it('onMouseMove should set the endPoint when mouseDown is true', () => {
        spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        spyOn(service, 'drawLine').and.returnValue();
        spyOn(service, 'drawCircle').and.returnValue();
        service.startingPoint = {x:15,y:99};

        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = true;
        service['drawingService'].resizeActive = false;
        service.onMouseMove(mouseEvent);
        expect(service.endPoint).toEqual({ x: 120, y: 14 });
    });

    it('onMouseMove should call drawLine, drawCircle and clearCanvas when mouseDown is true', () => {
        const clearCanavsSpy = spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        const drawLineSpy = spyOn(service, 'drawLine').and.returnValue();
        const drawCircleSpy = spyOn(service, 'drawCircle').and.returnValue();
        service.startingPoint = {x:15,y:99};
        
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = true;
        service['drawingService'].resizeActive = false;
        service.onMouseMove(mouseEvent);
        expect(clearCanavsSpy).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawCircleSpy).toHaveBeenCalled();
     });

    it('onMouseMove should notcall drawLine, drawCircle clearCanvas when mouseDown is false', () => {
        const clearCanavsSpy = spyOn(service['drawingService'], 'clearCanvas').and.returnValue();
        const drawLineSpy = spyOn(service, 'drawLine').and.returnValue();
        const drawCircleSpy = spyOn(service, 'drawCircle').and.returnValue();
        let mouseEvent: MouseEvent = { offsetX: 120, offsetY: 14 } as MouseEvent;
        service.mouseDown = false;
        service['drawingService'].resizeActive = false;
        service.onMouseMove(mouseEvent);
        expect(clearCanavsSpy).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(drawCircleSpy).not.toHaveBeenCalled();
    });

    it('clearArray should empty currentLine', () => {
        service.clearArrays();
        expect(service.currentLine).toEqual([]);
    });

    it('onButtonPress should toggle the value of showNumberOfSidesInput', () => {
        service.showNumberOfSidesInput = false;
        service.onButtonPress();
        expect(service.showNumberOfSidesInput).toEqual(true);
        service.showNumberOfSidesInput = true;
        service.onButtonPress();
        expect(service.showNumberOfSidesInput).toEqual(false);
    });

    it(' SetPreliminaryNumberOfsides should set premNumberOfSides when the input is a number', () => {
        for(let i = 3; i<=12; i++)
        {
             const keyboardEvent: KeyboardEvent = {} as KeyboardEvent;
             Object.defineProperty(keyboardEvent, 'target', { value: { value: i } });
            service.setNumberOfSides(keyboardEvent);
            expect(service.sides).toEqual(i);
        }
       
    });

    it(' SetPreliminaryNumberOfsides should set premNumberOfSides to NaN when the input is not a number', () => {
        const keyboardEvent: KeyboardEvent = {} as KeyboardEvent;
        Object.defineProperty(keyboardEvent, 'target', { value: { value: 'xyz' } });
        service.setNumberOfSides(keyboardEvent);
        expect(service.sides).toEqual(NaN);
    });


    // A check avec le charge
    // it('drawLine should call fill once when fill property of the polygon is true', () => {
    //     const polygonSpyObj = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
    //         'strokeStyle',
    //         'beginPath',
    //         'globalCompositeOperation',
    //         'setLineDash',
    //         'stroke',
    //         'moveTo',
    //         'lineTo',
    //         'fill',
    //         'lineWidth',
    //         'lineCap',
    //         'fillStyle',
    //     ]);
    //     Object.defineProperty(service['drawingService'].baseCtx, 'fillStyle', { value: 'blue' });
    //     Object.defineProperty(service['drawingService'].previewCtx, 'fillStyle', { value: 'red' });
    //     service.toolStyles.fill = true;
    //     service.drawLine(polygonSpyObj, [
    //         { x: 100, y: 113 },
    //         { x: 25, y: 200 },
    //     ]);
    //     expect(polygonSpyObj.fill).toHaveBeenCalledTimes(1);
    // });

    it('computeCircleValues should calculate every attribute relative to a circle from the two point sent in parametre', () => {
        service.sides = 4;
        service.computeCircleValues([{x:20,y:200},{x:142,y:45}]);
        expect(service.squareCornerPos).toEqual({x: 142, y: 78});
        expect(service.centerX).toEqual(81);
        expect(service.centerY).toEqual(139);
        expect(service.angle).toEqual(Math.PI/2);
        expect(service.radius).toEqual(61);
    });

    it('computeCircleValues should call closestSquare', () => {
        const closestSquareSpy = spyOn(service['squareHelper'], 'closestSquare').and.returnValue({x:0,y:0});
        service.computeCircleValues([{x:20,y:200},{x:142,y:45}]);
        expect(closestSquareSpy).toHaveBeenCalled();
      
    });



    

});
