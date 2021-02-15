//import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { Constant } from '@app/constants/general-constants-store';
import { ResizeService } from './resize.service';

//export class MockElementRef extends ElementRef {}

describe('ResizeService', () => {
    let service: ResizeService;
    let mouseEvent: MouseEvent;
    let canvas: DOMRect = { left: 500, right: 1500, top: 0, bottom: 500 } as DOMRect;
    let canvasSize: Vec2 = { x: 500, y: 300 };
    //let baseCanvas: ElementRef<HTMLCanvasElement>;

    mouseEvent = {
        button: 0,
    } as MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        //TestBed.configureTestingModule({ providers: [{ provide: ElementRef, useValue: MockElementRef }] });
        service = TestBed.inject(ResizeService);
        //baseCanvas = TestBed.get(ElementRef);
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

    it('resize should set preview.x and preview.y to MIN_WIDTH and MIN_HEIGH when isCorner is true', () => {
        service.isSide = false;
        service.isBottom = false;
        service.isCorner = true;
        service.mouseDown = true;
        let event: MouseEvent = { pageX: 150, pageY: 50 } as MouseEvent;
        service.resize(event, canvas);
        expect(service.preview).toEqual({ x: Constant.MIN_WIDTH, y: Constant.MIN_HEIGH });
    });

    // it('stopResize should set the canvasSize.y to be the same as preview.y when isBottom is true', () => {
    //     service.isBottom = true;
    //     service.preview.y = 5500;
    //     service.stopResize(canvasSize, baseCanvas);
    //     expect(canvasSize.y).toEqual(service.preview.y);
    // });

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
});
