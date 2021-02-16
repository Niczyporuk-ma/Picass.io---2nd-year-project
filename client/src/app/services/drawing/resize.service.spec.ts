import { ElementRef, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { Constant } from '@app/constants/general-constants-store';
import { ResizeService } from './resize.service';

@Injectable()
export class MockElementRef {
    nativeElement: {};
}

describe('ResizeService', () => {
    let service: ResizeService;
    let mouseEvent: MouseEvent;
    let canvas: DOMRect = { left: 500, right: 1500, top: 0, bottom: 500 } as DOMRect;
    let canvasSize: Vec2 = { x: 500, y: 300 };
    let dummyCanvas: ElementRef<HTMLCanvasElement>;
    let dummyNativeElement = document.createElement('canvas');

    mouseEvent = {
        button: 0,
    } as MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [{ provide: ElementRef, useValue: MockElementRef }] });
        service = TestBed.inject(ResizeService);
        dummyCanvas = new ElementRef<HTMLCanvasElement>(dummyNativeElement);

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        // tslint:disable:no-magic-numbers
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('startResize should set mouseDown to true on left click', () => {
        service.startResize(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it('startResize should sets resizeActive to true', () => {
        service.startResize(mouseEvent);
        expect(service['drawingService'].resizeActive).toEqual(true);
    });

    it('startResize shouldnt set resizeActive to false on right click', () => {
        let rightClickMouseEvent: MouseEvent = { button: 2 } as MouseEvent;
        service.startResize(rightClickMouseEvent);
        expect(service['drawingService'].resizeActive).toEqual(true);
    });

    it('startResize should set mouseDown to false on right click', () => {
        let rightClickMouseEvent: MouseEvent = { button: 2 } as MouseEvent;
        service.startResize(rightClickMouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it('resize should set preview.y to MIN_HEIGH when the mouse position is lower MIN_HEIGH when isBottom is true', () => {
        service.isBottom = true;
        service.mouseDown = true;
        let event: MouseEvent = { pageY: 100 } as MouseEvent;
        service.resize(event, canvas);
        expect(service.preview.y).toEqual(Constant.MIN_HEIGH);
    });

    it('resize should set preview.y to the good value when isBottom is true', () => {
        service.isBottom = true;
        service.mouseDown = true;
        let event: MouseEvent = { pageY: 800 } as MouseEvent;
        service.resize(event, canvas);
        expect(service.preview.y).toEqual(event.pageY);
    });

    it('resize should set preview.x to MIN_HEIGH when the mouse position is lower MIN_HEIGH when isSide is true', () => {
        service.isSide = true;
        service.mouseDown = true;
        let event: MouseEvent = { pageX: 100 } as MouseEvent;
        service.resize(event, canvas);
        expect(service.preview.x).toEqual(Constant.MIN_HEIGH);
    });

    it('resize should set preview.x to the good value when isSide is true', () => {
        service.isSide = true;
        service.isBottom = false;
        service.isCorner = false;
        service.mouseDown = true;
        let event: MouseEvent = { pageX: 800 } as MouseEvent;
        service.resize(event, canvas);
        expect(service.preview.x).toEqual(300);
    });

    it('resize should set preview.x and preview.y to the good value when isCorner is true', () => {
        service.isSide = false;
        service.isBottom = false;
        service.isCorner = true;
        service.mouseDown = true;
        let event: MouseEvent = { pageX: 800, pageY: 1000 } as MouseEvent;
        service.resize(event, canvas);
        expect(service.preview).toEqual({ x: 300, y: 1000 });
    });

    it('resize should set preview.x and preview.y to MIN_WIDTH and MIN_HEIGH when both are lower than 250x250 when isCorner is true', () => {
        service.isSide = false;
        service.isBottom = false;
        service.isCorner = true;
        service.mouseDown = true;
        let event: MouseEvent = { pageX: 150, pageY: 50 } as MouseEvent;
        service.resize(event, canvas);
        expect(service.preview).toEqual({ x: Constant.MIN_WIDTH, y: Constant.MIN_HEIGH });
    });

    it('stopResize should set the canvasSize.y to be the same as preview.y when isBottom is true', () => {
        service.isBottom = true;
        service.preview.y = 5500;
        service.sideHandle = { x: 0, y: 0 };
        service.bottomHandle = { x: 0, y: 0 };
        service.cornerHandle = { x: 0, y: 0 };
        service.stopResize(canvasSize, dummyCanvas);
        expect(canvasSize.y).toEqual(service.preview.y);
    });

    it('stopResize should set isBottom back to false when isBottom is true', () => {
        service.isBottom = true;
        service.preview.y = 5500;
        service.sideHandle = { x: 0, y: 0 };
        service.bottomHandle = { x: 0, y: 0 };
        service.cornerHandle = { x: 0, y: 0 };
        service.stopResize(canvasSize, dummyCanvas);
        expect(service.isBottom).toEqual(false);
    });

    it('stopResize should set the canvasSize.x to be the same as preview.x when isSide is true', () => {
        service.isSide = true;
        service.preview.x = 1200;
        service.sideHandle = { x: 0, y: 0 };
        service.bottomHandle = { x: 0, y: 0 };
        service.cornerHandle = { x: 0, y: 0 };
        service.stopResize(canvasSize, dummyCanvas);
        expect(canvasSize.x).toEqual(service.preview.x);
    });

    it('stopResize should set isSide back to false when isSide is true', () => {
        service.isSide = true;
        service.preview.x = 1234;
        service.sideHandle = { x: 0, y: 0 };
        service.bottomHandle = { x: 0, y: 0 };
        service.cornerHandle = { x: 0, y: 0 };
        service.stopResize(canvasSize, dummyCanvas);
        expect(service.isSide).toEqual(false);
    });

    it('stopResize should set the canvasSize.x and canvasSize.y to be the same as preview.x and preview.y when isCorner is true', () => {
        service.isCorner = true;
        service.preview = { x: 1234, y: 5677 };
        service.sideHandle = { x: 0, y: 0 };
        service.bottomHandle = { x: 0, y: 0 };
        service.cornerHandle = { x: 0, y: 0 };
        service.stopResize(canvasSize, dummyCanvas);
        expect(canvasSize.x).toEqual(service.preview.x);
        expect(canvasSize.y).toEqual(service.preview.y);
    });

    it('stopResize should set isSide back to false when isSide is true', () => {
        service.isCorner = true;
        service.preview.x = 1234;
        service.sideHandle = { x: 0, y: 0 };
        service.bottomHandle = { x: 0, y: 0 };
        service.cornerHandle = { x: 0, y: 0 };
        service.stopResize(canvasSize, dummyCanvas);
        expect(service.isCorner).toEqual(false);
    });

    it('stopResize should set mouseDown back to false', () => {
        service.mouseDown = true;
        service.preview.x = 1234;
        service.sideHandle = { x: 0, y: 0 };
        service.bottomHandle = { x: 0, y: 0 };
        service.cornerHandle = { x: 0, y: 0 };
        service.stopResize(canvasSize, dummyCanvas);
        expect(service.mouseDown).toEqual(false);
    });

    it('stopResize should call relocateHandle once', () => {
        let stopResizeSpy = spyOn<any>(service, 'stopResize').and.callThrough();
        service.mouseDown = true;
        service.preview = { x: 1234, y: 3456 };
        service.sideHandle = { x: 0, y: 0 };
        service.bottomHandle = { x: 0, y: 0 };
        service.cornerHandle = { x: 0, y: 0 };
        service.stopResize(canvasSize, dummyCanvas);
        expect(stopResizeSpy).toHaveBeenCalledTimes(1);
    });

    it('stopResize should set resizeActive back to false', () => {
        service['drawingService'].resizeActive = true;
        service.preview.x = 1234;
        service.sideHandle = { x: 0, y: 0 };
        service.bottomHandle = { x: 0, y: 0 };
        service.cornerHandle = { x: 0, y: 0 };
        service.stopResize(canvasSize, dummyCanvas);
        expect(service['drawingService'].resizeActive).toEqual(false);
    });

    it('relocateHandles should set handles positions based on the current size of the baseCanvas', () => {
        service.sideHandle = { x: 500, y: 500 };
        service.bottomHandle = { x: 300, y: 234 };
        service.cornerHandle = { x: 456, y: 577 };

        service.relocateHandles(canvasSize);

        expect(service.sideHandle.y).toEqual(canvasSize.y / 2);
        expect(service.sideHandle.x).toEqual(canvasSize.x);
        expect(service.bottomHandle.y).toEqual(canvasSize.y);
        expect(service.bottomHandle.x).toEqual(canvasSize.x / 2);
        expect(service.cornerHandle.y).toEqual(canvasSize.y);
        expect(service.cornerHandle.x).toEqual(canvasSize.x);
    });

    it('copyCanvas calls toDataURL() from the canvas', () => {
        const copyCanvasSpy = spyOn<any>(service, 'copyCanvas').and.callThrough();
        const toDataURLSpy = spyOn<any>(dummyCanvas.nativeElement, 'toDataURL').and.stub();
        service.copyCanvas(dummyCanvas);
        expect(copyCanvasSpy).toHaveBeenCalled();
        expect(toDataURLSpy).toHaveBeenCalled();
    });
});
