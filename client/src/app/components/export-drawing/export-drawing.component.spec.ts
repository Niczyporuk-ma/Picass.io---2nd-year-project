import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingComponent } from './export-drawing.component';

fdescribe('ExportDrawingComponent', () => {
    let component: ExportDrawingComponent;
    let fixture: ComponentFixture<ExportDrawingComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    // let baseCtxStub: CanvasRenderingContext2D;
    // let drawingStub: DrawingService;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawingServiceSpy.clearCanvas.and.returnValue();
        drawingServiceSpy.canvas = document.createElement('canvas');

        TestBed.configureTestingModule({
            declarations: [ExportDrawingComponent],
            providers: [FormBuilder, { provide: DrawingService, useValue: drawingServiceSpy }, { provide: MatDialog, useValue: {} }],
        }).compileComponents();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        // tslint:disable:no-magic-numbers
        // component.drawingService.baseCtx = baseCtxStub;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    fit('should create', () => {
        // console.log('TEST', component.drawingService);
        // component.drawingService.canvas = document.createElement('canvas');
        // console.log(component.drawingService.canvas);

        expect(component).toBeTruthy();
    });
});
