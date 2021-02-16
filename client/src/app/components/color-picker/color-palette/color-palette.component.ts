// inspired by : https://malcoded.com/posts/angular-color-picker/
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MouseButton } from '@app/enums/enums';
import { ColorService } from '@app/services/tools/color.service';

@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
    @Input()
    hue: string;

    @Output()
    color: EventEmitter<string> = new EventEmitter(true);

    // @ViewChild('canvas') canvasEl : ElementRef;
    @ViewChild('canvas', { read: ElementRef, static: true }) canvas: ElementRef<HTMLCanvasElement>;
    // canvas: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D;
    // as CanvasRenderingContext2D;

    private mousedown: boolean = false;
    private contextmenu: boolean = false;
    colorService: ColorService;
    mouseEvent: MouseEvent;
    showConfirmButton: boolean = false;

    selectedPosition: { x: number; y: number };

    constructor(colorService: ColorService) {
        this.colorService = colorService;
    }

    ngAfterViewInit(): void {
        this.draw();
    }

    draw(): void {
        const radius = 10;
        const startAngle = 0;
        const baseWidth = 5;

        if (!this.ctx) {
            this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        }
        const width = this.canvas.nativeElement.width;
        const height = this.canvas.nativeElement.height;

        this.ctx.fillStyle = this.hue || 'rgba(255,255,255,1)';
        this.ctx.fillRect(0, 0, width, height);

        const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

        this.ctx.fillStyle = whiteGrad;
        this.ctx.fillRect(0, 0, width, height);

        const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
        blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

        this.ctx.fillStyle = blackGrad;
        this.ctx.fillRect(0, 0, width, height);

        if (this.selectedPosition) {
            this.ctx.strokeStyle = 'white';
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, radius, startAngle, 2 * Math.PI);
            this.ctx.lineWidth = baseWidth;
            this.ctx.stroke();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hue) {
            this.draw();
            const pos = this.selectedPosition;
            if (pos) {
                this.color.emit(this.getColorAtPosition(pos.x, pos.y));
            }
        }
    }

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(evt: MouseEvent): void {
        this.mousedown = false;
    }

    onLeftClickDown(evt: MouseEvent): void {
        // PROBLEM WITH PREVIEW STILL
        this.mousedown = evt.button === MouseButton.Left;
        this.contextmenu = false;
        console.log(this.colorService.isConfirmed);

        if (this.contextmenu === false && this.mousedown === true) {
            this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
            this.draw();
            this.emitColor(evt.offsetX, evt.offsetY);
            if (this.colorService.isConfirmed) {
                this.resetBoolsAfterDecision();
            }
            this.colorService.primaryColorPreview = this.getColorAtPositionWithOpacity(
                evt.offsetX,
                evt.offsetY,
                this.colorService.primaryOpacityPreview,
            );
        }
        // this.mousedown = false;
    }

    resetBoolsAfterDecision(): void {
        this.colorService.isConfirmed = false;
        this.showConfirmButton = false;
        this.mousedown = false;
    }

    onRightClickDown(evt: MouseEvent): boolean {
        this.mousedown = false;
        this.contextmenu = true;
        this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
        this.draw();
        this.emitColor(evt.offsetX, evt.offsetY);
        if (this.colorService.isConfirmed) {
            this.resetBoolsAfterDecision();
            return false;
        }
        this.colorService.secondaryColorPreview = this.getColorAtPositionWithOpacity(
            evt.offsetX,
            evt.offsetY,
            this.colorService.secondaryOpacityPreview,
        );
        return false;
    }

    onMouseMove(evt: MouseEvent): void {
        if (this.mousedown) {
            this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
            this.draw();
            this.emitColor(evt.offsetX, evt.offsetY);
            this.colorService.primaryColorPreview = this.getColorAtPositionWithOpacity(
                evt.offsetX,
                evt.offsetY,
                this.colorService.primaryOpacityPreview,
            );
            if (this.colorService.isConfirmed) {
                this.colorService.primaryColor = this.colorService.primaryColorPreview;
            }
        }
    }

    emitColor(x: number, y: number): void {
        const rgbaColor = this.getColorAtPosition(x, y);
        this.color.emit(rgbaColor);
    }

    getColorAtPosition(x: number, y: number): string {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }

    getColorAtPositionWithOpacity(x: number, y: number, opacity: number): string {
        const imageData = this.ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',' + opacity + ')';
    }

    paletteClickHandler(evt: MouseEvent): boolean {
        this.mouseEvent = evt;
        this.colorService.showConfirmButton = true;
        return false;
    }
}
