import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from './tool-manager.service';

fdescribe('ToolManagerService', () => {
    let service: ToolManagerService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']); // un genre de proxy
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(ToolManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // source : https://stackoverflow.com/questions/52091882/angular-unit-testing-subject
    it(' setTool should call the next() method to set the Subject', () => {
        const nextSpy: jasmine.Spy<any> = spyOn<any>(service.currentToolChange, 'next').and.stub();
        service.setTool(service.lineService);
        expect(nextSpy).toHaveBeenCalled();
    });

    it(' setTool should set current tool to line', () => {
        service.setTool(service.lineService);
        expect(service.currentTool).toEqual(service.lineService);
    });

    it(' setTool should set current tool to eraser', () => {
        service.setTool(service.eraserService);
        expect(service.currentTool).toEqual(service.eraserService);
    });

    it(' setTool should set current tool to pencil', () => {
        service.setTool(service.pencilService);
        expect(service.currentTool).toEqual(service.pencilService);
    });

    it(' setTool should set current tool to rectangle', () => {
        service.setTool(service.rectangleService);
        expect(service.currentTool).toEqual(service.rectangleService);
    });

    // HOW????????
    it(' setTool should call setColors', () => {
        const setColorSpy = spyOn<any>(service.eraserService, 'setColors');
        service.setTool(service.eraserService);
        expect(setColorSpy).toHaveBeenCalled();
    });

    it(' clearArrays should call clearCanvas twice', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        drawingServiceSpy.drawingStarted = true;
        //const clearCanvasSpy = spyOn<any>(drawingServiceSpy, 'clearCanvas');
        service.clearArrays();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledTimes(2);
    });

    //a demander
    it(' clearArrays should call clearArrays for every tool', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        drawingServiceSpy.drawingStarted = true;
        const clearArrayEraserSpy = spyOn<any>(service.eraserService, 'clearArrays');
        const clearArrayPencilSpy = spyOn<any>(service.pencilService, 'clearArrays');
        const clearArrayRectangleSpy = spyOn<any>(service.rectangleService, 'clearArrays');
        const clearArrayLineSpy = spyOn<any>(service.lineService, 'clearArrays');
        service.clearArrays();
        expect(clearArrayEraserSpy).toHaveBeenCalled();
        expect(clearArrayPencilSpy).toHaveBeenCalled();
        expect(clearArrayRectangleSpy).toHaveBeenCalled();
        expect(clearArrayLineSpy).toHaveBeenCalled();
    });
});
