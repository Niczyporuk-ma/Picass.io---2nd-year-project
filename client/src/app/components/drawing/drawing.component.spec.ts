import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { DrawingComponent } from './drawing.component';

class ToolStub extends Tool {}

// TODO : Déplacer dans un fichier accessible à tous
const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 800;
const TIMEOUT_WAIT = 5000;

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService);
        drawingStub = new DrawingService();

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
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

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
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

    it(' ngAfterViewInit should add two event listener', () => {
        const enventListenerSpy = spyOn(window, 'addEventListener').and.callThrough();
        component.ngAfterViewInit();
        expect(enventListenerSpy).toHaveBeenCalledTimes(2);
    });

    /*it(" ngAfterViewInit should call onKeyPress & waitForOPress when Control is pressed", async (done) => {
        const event = new KeyboardEvent('keydown',{key :'Controle'});
        const onKeyPressSpy = spyOn(component.shortcutKeyboardManager,'onKeyPress').and.callFake(function() 
        {console.log("TEST");});
       const oPressSpy = spyOn(component.shortcutKeyboardManager,'waitForOPress').and.returnValue();
        component.ngAfterViewInit();
        window.dispatchEvent(event);
        setTimeout(() => {
            expect(onKeyPressSpy).toHaveBeenCalled();
            expect(oPressSpy).toHaveBeenCalled();
            done();
        }, 2000);//
        
    });*/

    it(' onMouseClick should call onMouseClick of current tool if there is a single click', async (done) => {
        const event = {} as MouseEvent;
        const onMouseCLickSpy = spyOn(component.toolManager.currentTool, 'onMouseClick').and.callThrough();
        component.onMouseClick(event);
        setTimeout(() => {
            expect(onMouseCLickSpy).toHaveBeenCalled();
            done();
        }, component.timeOutDuration);
    });

    it(' onMouseClick should call onDoubleClick of current tool if there is a double click', async (done) => {
        const event = {} as MouseEvent;
        const onDoubleCLickSpy = spyOn(component.toolManager.currentTool, 'onDoubleClick').and.callThrough();
        component.onMouseClick(event);
        setTimeout(() => {
            component.clickCount++;
            done();
        }, component.timeOutDuration / 16);

        setTimeout(() => {
            expect(onDoubleCLickSpy).toHaveBeenCalled();
            done();
        }, TIMEOUT_WAIT); // ca depend de la vitesse de ton ordi :(
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
