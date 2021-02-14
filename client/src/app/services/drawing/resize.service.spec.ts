import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { ResizeService } from './resize.service';

fdescribe('ResizeService', () => {
    let service: ResizeService;
    let mouseEvent: MouseEvent;
    let canvasSize: Vec2 = { x: 500, y: 300 };

    mouseEvent = {
        button: 0,
    } as MouseEvent;

    let rightClickMouseEvent: MouseEvent;
    rightClickMouseEvent = { button: 2 } as MouseEvent;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizeService);
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
        service.startResize(rightClickMouseEvent);
        expect(service['drawingService'].resizeActive).toEqual(false);
    });

    it('relocateHandles should set handles positions based on the current size of the baseCanvas', () => {
        service.relocateHandles(canvasSize);
        expect(service.sideHandle.y).toEqual(canvasSize.y / 2);
        expect(service.sideHandle.x).toEqual(canvasSize.x);
        expect(service.bottomHandle.y).toEqual(canvasSize.y);
        expect(service.bottomHandle.x).toEqual(canvasSize.x / 2);
        expect(service.cornerHandle.y).toEqual(canvasSize.y);
        expect(service.cornerHandle.x).toEqual(canvasSize.x);
    });
});
