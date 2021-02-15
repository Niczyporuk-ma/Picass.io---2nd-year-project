import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from './tool-manager.service';

describe('ToolManagerService', () => {
    let service: ToolManagerService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        // tslint:disable:no-magic-numbers
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
        const nextSpy = spyOn(service.currentToolChange, 'next').and.stub();
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

    it(' setTool should call setColors', () => {
        const setColorSpy = spyOn(service.eraserService, 'setColors');
        service.setTool(service.eraserService);
        expect(setColorSpy).toHaveBeenCalled();
    });

    it(' clearArrays should call clearCanvas twice when the client has confirmed his choice to start a new drawing', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        drawingServiceSpy.drawingStarted = true;
        service.clearArrays();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalledTimes(2);
    });

    it(' clearArrays should not call clearCanvaswhen the client has not confirmed his choice to start a new drawing', () => {
        spyOn(window, 'confirm').and.returnValue(false);
        drawingServiceSpy.drawingStarted = true;
        service.clearArrays();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it(' clearArrays should call clearArrays for every tool when the client has confirmed his choice to start a new drawing', () => {
        spyOn(window, 'confirm').and.returnValue(true);

        for (const tool of service.tools) {
            drawingServiceSpy.drawingStarted = true;
            const clearArraySpy = spyOn(tool, 'clearArrays');
            service.clearArrays();
            expect(clearArraySpy).toHaveBeenCalled();
        }
    });

    it(' clearArrays should set drawingStarted to false when the client has confirmed his choice to start a new drawing ', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        drawingServiceSpy.drawingStarted = true;
        service.clearArrays();
        expect(drawingServiceSpy.drawingStarted).toEqual(false);
    });
});
