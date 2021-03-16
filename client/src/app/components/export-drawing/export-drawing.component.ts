import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    exportForm: FormGroup;
    fileNameControl: FormControl = new FormControl('', [Validators.pattern('^[a-zA-ZÀ-ÿ](\\d|[a-zA-ZÀ-ÿ ]){0,20}$'), Validators.required]);
    fileExtentionControl: FormControl = new FormControl('', [Validators.required]);
    filterControl: FormControl = new FormControl('', [Validators.required]);

    @ViewChild('filterPreviewCanvas', { static: false }) filterPreviewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('downloadLink') downloadLink: ElementRef;

    filterPreviewCtx: CanvasRenderingContext2D;

    constructor(private formBuilder: FormBuilder, public drawingService: DrawingService, private toolManager: ToolManagerService) {
        this.exportForm = this.formBuilder.group({
            fileName: this.fileNameControl,
            fileExtension: this.fileExtentionControl,
            filter: this.filterControl,
        });
        //this.exportForm.markAsDirty(); ///saves a lot of trouble?? - no needed anymore
    }

    ngAfterViewInit(): void {
        this.filterPreviewCtx = this.filterPreviewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawImageOnCanvas();
    }

    drawImageOnCanvas(): void {
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
        const imageUrl = this.filterPreviewCanvas.nativeElement.toDataURL('image/' + this.fileExtentionControl.value);
        this.downloadLink.nativeElement.href = imageUrl;
        console.log(this.fileExtentionControl.value);
        this.downloadLink.nativeElement.download = this.fileNameControl.value + '.' + this.fileExtentionControl.value;
        this.downloadLink.nativeElement.click();
    }

    ApplyFilter() {
        this.filterPreviewCtx.filter = 'sepia(100%)';
        this.drawImageOnCanvas();
    }

    // TODO : find a way to disable ctrl+O

    disableShortcut(): void {
        this.toolManager.allowKeyPressEvents = false;
    }

    enableShortcut(): void {
        this.toolManager.allowKeyPressEvents = true;
    }
}
