import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    exportForm: FormGroup;
    drawingNameControl: FormControl = new FormControl('', [Validators.pattern('^[a-zA-ZÀ-ÿ](\\d|[a-zA-ZÀ-ÿ ]){0,20}$'), Validators.required]);
    extentionControl: FormControl = new FormControl('', [Validators.pattern('^[a-zA-ZÀ-ÿ](\\d|[a-zA-ZÀ-ÿ ]){0,20}$'), Validators.required]);

    @ViewChild('filterPreviewCanvas', { static: false }) filterPreviewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('drawingLink') drawingLink: ElementRef;

    filterPreviewCtx: CanvasRenderingContext2D;

    // drawingNameControl: FormControl = new FormControl('', [Validators.pattern('^[a-zA-ZÀ-ÿ](\\d|[a-zA-ZÀ-ÿ ]){0,20}$'), Validators.required]);

    constructor(private formBuilder: FormBuilder, public drawingService: DrawingService) {
        this.exportForm = this.formBuilder.group({
            id: '',
            name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
            tags: this.formBuilder.array([]),
        });
        this.exportForm.markAsDirty(); ///saves a lot of trouble??
    }

    setupPreviewContext(): void {
        this.filterPreviewCtx.drawImage(
            this.drawingService.canvas,
            0,
            0,
            this.drawingService.canvas.width,
            this.drawingService.canvas.height,
            0,
            0,
            this.filterPreviewCanvas.nativeElement.width,
            this.filterPreviewCanvas.nativeElement.height,
        );
    }

    ExportDrawing() {
        //const format = 'image/' + this.selectedFormat;
        const imageUrl = this.filterPreviewCanvas.nativeElement.toDataURL('image/png');
        this.drawingLink.nativeElement.href = imageUrl;
        this.drawingLink.nativeElement.download = 'canvas.png';
        this.drawingLink.nativeElement.click();
    }

    ngAfterViewInit(): void {
        this.filterPreviewCtx = this.filterPreviewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.setupPreviewContext();
    }
}
