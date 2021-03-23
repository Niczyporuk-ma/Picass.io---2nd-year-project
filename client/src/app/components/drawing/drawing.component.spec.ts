import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { DrawingComponent } from './drawing.component';

class ToolStub extends Tool {}

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 800;
const TIMEOUT_WAIT = 5000;

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;

    // tslint:disable:no-magic-numbers

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService();

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a default WIDTH and HEIGHT', () => {
        const height = component.height;
        const width = component.width;
        expect(height).toEqual(DEFAULT_HEIGHT);
        expect(width).toEqual(DEFAULT_WIDTH);
    });

    it('should get stubTool', () => {
        const currentTool = component.currentTool;
        expect(currentTool).toEqual(toolStub);
    });

    it("should call the resizeService's resize method called", () => {
        component.resizeService.mouseDown = true;
        const event = {} as MouseEvent;
        const resizeSpy = spyOn(component.resizeService, 'resize').and.stub();
        component.onMouseMove(event);
        expect(resizeSpy).toHaveBeenCalled();
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = { pageX: 10000000 } as MouseEvent;
        const mouseEventSpy = spyOn(component.currentTool, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('onMouseMove should call ellipse onMouseMove if its the current tool and mouse is down', () => {
        const event = {} as MouseEvent;
        const ellipseMouseMoveSpy = spyOn(component.toolManager.ellipseService, 'onMouseMove').and.stub();
        component.toolManager.setTool(component.toolManager.ellipseService);
        component.toolManager.ellipseService.mouseDown = true;
        component.onMouseMove(event);
        expect(ellipseMouseMoveSpy).toHaveBeenCalled();
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('onMouseUp should call stopResize if mouseDown is true', () => {
        component.resizeService.mouseDown = true;
        const stopResizeSpy = spyOn(component.resizeService, 'stopResize').and.stub();
        const event = {} as MouseEvent;
        component.onMouseUp(event);
        expect(stopResizeSpy).toHaveBeenCalled();
    });

    it(' ngAfterViewInit should add two event listener', () => {
        const enventListenerSpy = spyOn(window, 'addEventListener').and.callThrough();
        component.ngAfterViewInit();
        expect(enventListenerSpy).toHaveBeenCalledTimes(2);
    });

    it('component should call keyupHandler on keyup if currentTool is ellipseSelection or rectangleSelection', () => {
        const mockArrowUp = new KeyboardEvent('keyup', { key: 'ArrowUp' });
        const mockArrowDown = new KeyboardEvent('keyup', { key: 'ArrowDown' });
        const mockArrowLeft = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
        const mockArrowRight = new KeyboardEvent('keyup', { key: 'ArrowRight' });
        component.toolManager.currentTool = component.toolManager.ellipseSelection;
        const keyupHandlerSpy = spyOn(component.toolManager.ellipseSelection, 'keyupHandler').and.callThrough();
        component.toolManager.ellipseSelection.offsetYModifier = 0;
        component.toolManager.ellipseSelection.offsetXModifier = 0;

        window.dispatchEvent(mockArrowUp);
        setTimeout(() => {
            return;
        }, 200);

        window.dispatchEvent(mockArrowDown);
        setTimeout(() => {
            return;
        }, 200);

        window.dispatchEvent(mockArrowLeft);
        setTimeout(() => {
            return;
        }, 200);

        window.dispatchEvent(mockArrowRight);
        setTimeout(() => {
            return;
        }, 200);

        expect(keyupHandlerSpy).toHaveBeenCalledTimes(4);
        expect(component.toolManager.ellipseSelection.offsetYModifier).toEqual(0);
        expect(component.toolManager.ellipseSelection.offsetXModifier).toEqual(0);
    });

    it(' onMouseClick should call onMouseClick of current tool if there is a single click', async (done) => {
        const event = {} as MouseEvent;
        const onMouseCLickSpy = spyOn(component.toolManager.currentTool, 'onMouseClick').and.callThrough();
        component.onMouseClick(event);
        setTimeout(() => {
            expect(onMouseCLickSpy).toHaveBeenCalled();
            done();
        }, component.timeOutDuration);
    });

    it('onMouseClick does nothing if clickCount != 1', () => {
        component.clickCount = -1;
        const event = {} as MouseEvent;
        const onMouseCLickSpy = spyOn(component.toolManager.currentTool, 'onMouseClick').and.stub();
        component.onMouseClick(event);
        expect(onMouseCLickSpy).not.toHaveBeenCalled();
    });

    it(' onMouseClick should call onDoubleClick of current tool if there is a double click', async (done) => {
        const event = {} as MouseEvent;
        const onDoubleCLickSpy = spyOn(component.toolManager.currentTool, 'onDoubleClick').and.callThrough();
        component.onMouseClick(event);
        setTimeout(() => {
            expect(onDoubleCLickSpy).not.toHaveBeenCalled();
            component.clickCount++;
            done();
        }, component.timeOutDuration / 16);

        setTimeout(() => {
            expect(onDoubleCLickSpy).toHaveBeenCalled();
            done();
        }, TIMEOUT_WAIT);
    });

    it(' onMouseClick should reset the click count to 0 after processing the event', async (done) => {
        const event = {} as MouseEvent;
        component.onMouseClick(event);
        setTimeout(() => {
            expect(component.clickCount).toEqual(0);
            done();
        }, component.timeOutDuration);
    });
});
