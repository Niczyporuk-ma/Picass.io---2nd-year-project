import { ElementRef, Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { Constant } from '@app/constants/general-constants-store';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ResizeService {
    mouseDown: boolean = false;
    isCorner: boolean = false;
    isSide: boolean = false;
    isBottom: boolean = false;
    bottomHandle: Vec2;
    sideHandle: Vec2;
    cornerHandle: Vec2;
    preview: Vec2 = { x: Constant.DEFAULT_WIDTH, y: Constant.DEFAULT_HEIGHT };

    constructor(public drawingService: DrawingService) {}

    startResize(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.drawingService.resizeActive = true;
    }

    resize(event: MouseEvent, canvas: DOMRect): void {
        if (this.mouseDown) {
            if (this.isBottom) {
                this.preview.y = event.pageY >= Constant.MIN_HEIGH ? event.pageY : Constant.MIN_HEIGH;
            } else if (this.isSide) {
                this.preview.x = event.pageX - (canvas.left + window.scrollY) >= Constant.MIN_WIDTH ? event.pageX - canvas.left : Constant.MIN_WIDTH;
            } else if (this.isCorner) {
                this.preview.y = event.pageY >= Constant.MIN_HEIGH ? event.pageY : Constant.MIN_HEIGH;
                this.preview.x = event.pageX - (canvas.left + window.scrollY) >= Constant.MIN_WIDTH ? event.pageX - canvas.left : Constant.MIN_WIDTH;
            }
        }
    }

    stopResize(canvasSize: Vec2, baseCanvas: ElementRef<HTMLCanvasElement>): void {
        this.copyCanvas(baseCanvas);

        if (this.isBottom) {
            canvasSize.y = this.preview.y;
            this.isBottom = false;
        } else if (this.isSide) {
            canvasSize.x = this.preview.x;
            this.isSide = false;
        } else if (this.isCorner) {
            canvasSize.x = this.preview.x;
            canvasSize.y = this.preview.y;
            this.isCorner = false;
        }
        this.mouseDown = false;
        this.relocateHandles(canvasSize);
        this.drawingService.resizeActive = false;
    }

    // inspired by the answer dating from Nov 10 '10 at 14:31
    // https://stackoverflow.com/questions/4137372/display-canvas-image-from-one-canvas-to-another-canvas-using-base64
    copyCanvas(baseCanvas: ElementRef<HTMLCanvasElement>): void {
        const imageTemp = new Image();
        imageTemp.src = baseCanvas.nativeElement.toDataURL();
        const newCtx = baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        imageTemp.onload = () => {
            newCtx.fillStyle = 'white';
            newCtx.fillRect(0, 0, newCtx.canvas.width, newCtx.canvas.height);
            newCtx.drawImage(imageTemp, 0, 0);
        };
    }

    relocateHandles(canvasSize: Vec2): void {
        this.sideHandle.y = canvasSize.y / 2;
        this.sideHandle.x = canvasSize.x;
        this.bottomHandle.y = canvasSize.y;
        this.bottomHandle.x = canvasSize.x / 2;
        this.cornerHandle.y = canvasSize.y;
        this.cornerHandle.x = canvasSize.x;
    }
}
