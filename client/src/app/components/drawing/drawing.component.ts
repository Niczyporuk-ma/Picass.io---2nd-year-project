import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyboardShortcutManagerService } from '@app/services/tools/keyboard-shortcut-manager.service';
import { MouseButton } from '@app/services/tools/pencil-service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;
export const MIN_HEIGH: number = 250;
export const MIN_WIDTH = 250;

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;

    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private previouscanvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    private mouseDown: boolean = false;
    isCorner: boolean = false;
    isSide: boolean = false;
    isBottom: boolean = false;
    bottomAnchorPosition: Vec2;
    sideAnchorPosition: Vec2;
    cornerAnchorPosition: Vec2;

    timeOutDuration: number = 170;

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    tools: Tool[];
    currentTool: Tool;
    shortcutKeyboardManager: KeyboardShortcutManagerService;
    toolManager: ToolManagerService;
    clickCount: number = 0;
    constructor(private drawingService: DrawingService, toolManager: ToolManagerService, keyboardManager: KeyboardShortcutManagerService) {
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
        this.shortcutKeyboardManager = keyboardManager;
        this.toolManager.currentToolChange.subscribe((value) => (this.currentTool = value));
        this.currentTool = this.toolManager.currentTool;
        this.bottomAnchorPosition = { x: this.canvasSize.x / 2, y: this.canvasSize.y };
        this.sideAnchorPosition = { x: this.canvasSize.x, y: this.canvasSize.y / 2 };
        this.cornerAnchorPosition = { x: this.canvasSize.x, y: this.canvasSize.y };
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            this.shortcutKeyboardManager.onKeyPress(event.key);
        });
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentTool.onMouseMove(event);
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        this.clickCount++;
        if (this.clickCount === 1) {
            setTimeout(() => {
                if (this.clickCount === 1) {
                    this.currentTool.onMouseClick(event);
                } else {
                    this.currentTool.onDoubleClick(event);
                }
                this.clickCount = 0;
            }, this.timeOutDuration);
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.currentTool.onMouseDown(event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentTool.onMouseUp(event);
    }

    // //Inspired by: https://www.youtube.com/watch?v=NyZSIhzz5Do&ab_channel=JonasGr%C3%B8ndahl
    startResize(event: MouseEvent) {
        this.mouseDown = event.button === MouseButton.Left;
        this.previouscanvasSize.x += this.canvasSize.x;
        this.previouscanvasSize.y = this.canvasSize.y;
    }

    resize(event: MouseEvent) {
        if (event.button === 0) {
            const canvas = this.baseCanvas.nativeElement.getBoundingClientRect();

            if (this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.previewCtx.setLineDash([5, 5]);
                this.previewCtx.beginPath();
                if (this.isBottom) {
                    //Dash horizontal
                    this.previewCtx.moveTo(
                        0,
                        event.pageY - (canvas.top + window.scrollY) >= MIN_HEIGH ? event.pageY - (canvas.top + window.scrollY) : MIN_HEIGH,
                    );
                    this.previewCtx.lineTo(
                        canvas.right + window.scrollX,
                        event.pageY - (canvas.top + window.scrollY) >= MIN_HEIGH ? event.pageY - (canvas.top + window.scrollY) : MIN_HEIGH,
                    );
                } else if (this.isSide) {
                    //dash vertical
                    this.previewCtx.moveTo(
                        event.pageX - (canvas.left + window.scrollX) >= MIN_WIDTH ? event.pageX - (canvas.left + window.scrollX) : MIN_WIDTH,
                        canvas.top + window.scrollY,
                    );
                    this.previewCtx.lineTo(
                        event.pageX - (canvas.left + window.scrollX) >= MIN_WIDTH ? event.pageX - (canvas.left + window.scrollX) : MIN_WIDTH,
                        canvas.bottom + window.scrollY,
                    );
                } else if (this.isCorner) {
                    //dash vertical
                    this.previewCtx.moveTo(
                        event.pageX - (canvas.left + window.scrollX) >= MIN_WIDTH ? event.pageX - (canvas.left + window.scrollX) : MIN_WIDTH,
                        canvas.top + window.scrollY,
                    );
                    this.previewCtx.lineTo(
                        event.pageX - (canvas.left + window.scrollX) >= MIN_WIDTH ? event.pageX - (canvas.left + window.scrollX) : MIN_WIDTH,
                        event.pageY - (canvas.top + window.scrollY) >= MIN_HEIGH ? event.pageY - (canvas.top + window.scrollY) : MIN_HEIGH,
                    );
                    //Dash horizontal
                    this.previewCtx.moveTo(
                        0,
                        event.pageY - (canvas.top + window.scrollY) >= MIN_HEIGH ? event.pageY - (canvas.top + window.scrollY) : MIN_HEIGH,
                    );
                    this.previewCtx.lineTo(
                        event.pageX - (canvas.left + window.scrollX) >= MIN_WIDTH ? event.pageX - (canvas.left + window.scrollX) : MIN_WIDTH,
                        event.pageY - (canvas.top + window.scrollY) >= MIN_HEIGH ? event.pageY - (canvas.top + window.scrollY) : MIN_HEIGH,
                    );
                }
                this.previewCtx.stroke();
                this.previewCtx.setLineDash([]);
            }
        }
    }

    stopResize(event: MouseEvent) {
        this.mouseDown = false;
        const canvas = this.previewCanvas.nativeElement.getBoundingClientRect();
        debugger;

        if (this.isBottom) {
            this.canvasSize.y = event.pageY - (canvas.top + window.scrollY) >= MIN_HEIGH ? event.pageY - (canvas.top + window.scrollY) : MIN_HEIGH;
            //Relocation of other anchors
            // this.sideAnchorPosition.y = (event.pageY - (canvas.top + window.scrollY)) / 2;
            // this.cornerAnchorPosition.y = event.pageY - (canvas.top + window.scrollY);
        } else if (this.isSide) {
            this.canvasSize.x = event.pageX - (canvas.left + window.scrollX) >= MIN_WIDTH ? event.pageX - (canvas.left + window.scrollX) : MIN_WIDTH;
            //Relocation of other anchors
            // this.bottomAnchorPosition.x = (event.pageX - (canvas.left + window.scrollX)) / 2;
            // this.cornerAnchorPosition.x = event.pageX - (canvas.left + window.scrollX);
        } else if (this.isCorner) {
            this.canvasSize.x = event.pageX - (canvas.left + window.scrollX) >= MIN_WIDTH ? event.pageX - (canvas.left + window.scrollX) : MIN_WIDTH;
            this.canvasSize.y = event.pageY - (canvas.top + window.scrollY) >= MIN_HEIGH ? event.pageY - (canvas.top + window.scrollY) : MIN_HEIGH;
            //Relocation of other anchors
            //this.bottomAnchorPosition.x = (event.pageX - (canvas.left + window.scrollX)) / 2;
            //this.bottomAnchorPosition.y = event.pageY - (canvas.top + window.scrollY);
            //this.bottomAnchorPosition.y = this.canvasSize.y;
            //this.sideAnchorPosition.x = event.pageX - (canvas.left + window.scrollX);
            // this.sideAnchorPosition.x = this.canvasSize.x;
            // this.sideAnchorPosition.y = (event.pageY - (canvas.top + window.scrollY)) / 2;
        }
        //this.relocateAnchors(event, canvas);
        this.mouseDown = false;
        this.isBottom = false;
        this.isCorner = false;
        this.isSide = false;
        this.copyCanvas(this.baseCanvas);
    }

    //TODO: BUG quand full ellipse in color
    // partially inspired by the answer dating from Nov 10 '10 at 14:31
    //https://stackoverflow.com/questions/4137372/display-canvas-image-from-one-canvas-to-another-canvas-using-base64
    copyCanvas(baseCanvas: ElementRef<HTMLCanvasElement>): void {
        //save the old canvas temporarly as an image and then redrow it
        const imageTemp = new Image();
        imageTemp.src = baseCanvas.nativeElement.toDataURL();
        const newCtx = baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        imageTemp.onload = () => {
            newCtx.fillStyle = 'white';
            newCtx.fillRect(0, 0, newCtx.canvas.width, newCtx.canvas.height);
            newCtx.drawImage(imageTemp, 0, 0);
        };
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
    // /* *** Pour une raison quelconque sa fait disparaitre le anchor  quand on depasse
    //  * on depassse la limite de 250x250 ***
    //  */
    // canvasSizeVerificationForY(event: MouseEvent): number {
    //     if (event.clientY < MIN_HEIGH) {
    //         const bottomAnchor = document.getElementById('bottomAnchor')!;
    //         bottomAnchor.style.top = '250px';
    //         return MIN_HEIGH;
    //     }
    //     console.log('verif');
    //     return event.clientY;
    // }

    relocateAnchors(event: MouseEvent, canvas: DOMRect): void {
        // this.sideAnchorPosition.y = (event.pageY - (canvas.top + window.scrollY)) / 2;
        // this.sideAnchorPosition.x = event.pageX - (canvas.left + window.scrollX);
        // this.bottomAnchorPosition.y = event.pageY - (canvas.top + window.scrollY);
        // this.bottomAnchorPosition.x = (event.pageX - (canvas.left + window.scrollX)) / 2;
        // this.cornerAnchorPosition.y = event.pageY - (canvas.top + window.scrollY);
        // this.cornerAnchorPosition.x = event.pageX - (canvas.left + window.scrollX);

        this.sideAnchorPosition.y = this.canvasSize.y / 2;
        this.sideAnchorPosition.x = this.canvasSize.x;
        this.bottomAnchorPosition.y = this.previouscanvasSize.y; // + (canvas.top + window.scrollY); // + (canvas.top - window.scrollY); //(canvas.top + window.scrollY);
        this.bottomAnchorPosition.x = this.canvasSize.x / 2;
        this.cornerAnchorPosition.y = this.canvasSize.y; //event.pageY - (canvas.top + window.scrollY);
        this.cornerAnchorPosition.x = this.canvasSize.x; //event.pageX - (canvas.left + window.scrollX);
    }
}
