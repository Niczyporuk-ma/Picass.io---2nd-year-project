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
    // @ViewChild('bottomAnchor', { static: false }) bottomAnchor: ElementRef<button>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;

    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    private mouseDown: boolean = false;
    isCorner: boolean = false;
    isSide: boolean = false;
    isBottom: boolean = false;

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
        console.log('start resize!');
        this.mouseDown = event.button === MouseButton.Left;
    }

    resize(event: MouseEvent) {
        if (event.button === 0) {
            console.log('resize!');

            if (this.mouseDown) {
                console.log('resize mouse down');
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.previewCtx.setLineDash([5, 5]);
                this.previewCtx.beginPath();
                if (this.isBottom) {
                    console.log('bottom');
                    this.previewCtx.moveTo(0, event.clientY);
                    this.previewCtx.lineTo(1000, event.clientY);
                } else if (this.isSide) {
                    console.log('resize side');
                    this.previewCtx.moveTo(event.clientX - 518, 0);
                    this.previewCtx.lineTo(event.clientX - 518, 800);
                } else if (this.isCorner) {
                    console.log(' resize corner');
                    //dash vertical
                    this.previewCtx.moveTo(event.clientX - 518, 0);
                    this.previewCtx.lineTo(event.clientX - 518, event.clientY);
                    //Dash horizontal
                    this.previewCtx.moveTo(0, event.clientY);
                    this.previewCtx.lineTo(event.clientX - 518, event.clientY);
                }
                this.previewCtx.stroke();
                this.previewCtx.setLineDash([]);
            }
        }
    }

    stopResize(event: MouseEvent) {
        console.log('stop!');
        this.mouseDown = false;
        debugger;

        if (this.isBottom) {
            console.log('bottom anchor stopResize');
            this.canvasSize.y = event.clientY;
            const topCorner: number = this.canvasSize.y / 2;
            console.log(this.canvasSize.y + ' - ' + topCorner);

            //Relocate the other two anchors
            // TODO: the angular way of accessing the DOM avec ViewChild

            document.getElementById('cornerAnchor')!.style.top = this.canvasSize.y.toString() + 'px';
            document.getElementById('sideAnchor')!.style.top = topCorner.toString() + 'px';

            console.log(document.getElementById('cornerAnchor')!.style);
            console.log(this.canvasSize.x.toString() + ' - ' + this.canvasSize.y.toString());
        } else if (this.isSide) {
            console.log('side anchor stopResize');
            this.canvasSize.x = event.clientX - 518;
            const middleBottom: number = this.canvasSize.x / 2;

            //Relocate the other two anchors
            document.getElementById('cornerAnchor')!.style.left = this.canvasSize.x.toString() + 'px';
            document.getElementById('bottomAnchor')!.style.left = middleBottom + 'px';
        } else if (this.isCorner) {
            console.log('corner anchor stopResize');
            this.canvasSize.x = event.clientX - 518;
            this.canvasSize.y = event.clientY;
            const middleBottomX: number = this.canvasSize.x / 2;
            const middleSide: number = this.canvasSize.y / 2;
            //Relocate the other two anchors
            document.getElementById('bottomAnchor')!.style.top = this.canvasSize.y.toString() + 'px';
            document.getElementById('bottomAnchor')!.style.left = middleBottomX.toString() + 'px';
            document.getElementById('sideAnchor')!.style.left = this.canvasSize.x.toString() + 'px';
            document.getElementById('sideAnchor')!.style.top = middleSide.toString() + 'px';
        }

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
}
