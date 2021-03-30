import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from './grid.service';

describe('GridService', () => {
    let service: GridService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let ctxSpyObject: jasmine.SpyObj<CanvasRenderingContext2D>;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawingServiceSpy.canvas = document.createElement('canvas');
        ctxSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'strokeStyle',
            'beginPath',
            'moveTo',
            'lineTo',
            'stroke',
        ]);
        drawingServiceSpy.gridCtx = ctxSpyObject;

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });

        service = TestBed.inject(GridService);
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        // tslint:disable:no-magic-numbers
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('eraseGrid should call clearCanvas from the drawing service once', () => {
        service.eraseGrid();
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('setUpGrid should assign canvasWidth and canvasHeight with values from the drawingService', () => {
        const widthFromDrawingService = service['drawingService'].canvas.width;
        const heightFromDrawingService = service['drawingService'].canvas.height;
        service.setUpGrid();
        expect(service.canvasWidth).toEqual(widthFromDrawingService);
        expect(service.canvasHeight).toEqual(heightFromDrawingService);
    });

    it('setUpGrid assign the line opacity of the gridCtx to be the same as lineOpacity memeber', () => {
        service.lineOpacity = 0.6;
        const newRgbaValueGenerated = 'rgba(0,0,0,0.6)';
        service.setUpGrid();
        expect(drawingServiceSpy.gridCtx.strokeStyle).toEqual(newRgbaValueGenerated);
    });

    it('drawGrid should call eraseGrid and setUpGrid once', () => {
        const eraseGridSpy = spyOn(service, 'eraseGrid').and.callThrough();
        const setUpGridSpy = spyOn(service, 'setUpGrid').and.callThrough();
        service.drawGrid();
        expect(eraseGridSpy).toHaveBeenCalled();
        expect(setUpGridSpy).toHaveBeenCalled();
    });
});
