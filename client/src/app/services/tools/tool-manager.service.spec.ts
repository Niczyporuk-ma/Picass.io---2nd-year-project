import { TestBed } from '@angular/core/testing';
import { ToolManagerService } from './tool-manager.service';

describe('ToolManagerService', () => {
    let service: ToolManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    //source : https://stackoverflow.com/questions/52091882/angular-unit-testing-subject
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

    /*it(' setPencilService should  call the next() method to set the Subject', () => {
        const nextSpy: jasmine.Spy<any> = spyOn<any>(service.currentToolChange, 'next').and.stub();
        service.setPencilService();
        expect(nextSpy).toHaveBeenCalled();
    });

    it(' setEraserService should call the next() method to set the Subject', () => {
        const nextSpy: jasmine.Spy<any> = spyOn<any>(service.currentToolChange, 'next').and.stub();
        service.setEraserService();
        expect(nextSpy).toHaveBeenCalled();
    });

    it(' setLineService should call the next() method to set the Subject', () => {
        const nextSpy: jasmine.Spy<any> = spyOn<any>(service.currentToolChange, 'next').and.stub();
        service.setLineService();
        expect(nextSpy).toHaveBeenCalled();
    });

    it(' setRectangleService should call the next() method to set the Subject', () => {
        const nextSpy: jasmine.Spy<any> = spyOn<any>(service.currentToolChange, 'next').and.stub();
        service.setRectangleService();
        expect(nextSpy).toHaveBeenCalled();
    });

    it(' setPencilService should set the current Tool to Pencil', () => {
        service.setPencilService();
        expect(service.currentTool).toEqual(service.pencilService);
    });

    it(' setEraserService should set the current Tool to Eraser', () => {
        service.setEraserService();
        expect(service.currentTool).toEqual(service.eraserService);
    });

    it(' setLineService should set the current Tool to Line', () => {
        service.setLineService();
        expect(service.currentTool).toEqual(service.lineService);
    });

    it(' setRectangleService should set the current Tool to Rectangle', () => {
        service.setRectangleService();
        expect(service.currentTool).toEqual(service.rectangleService);
    })*/
});
