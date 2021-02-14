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
    @ViewChild('baseCanvas', { static: true }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;

    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    preview: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    mouseDown: boolean = false;
    isCorner: boolean = false;
    isSide: boolean = false;
    isBottom: boolean = false;
    bottomAnchorPosition: Vec2 = { x: DEFAULT_WIDTH / 2, y: DEFAULT_HEIGHT };
    sideAnchorPosition: Vec2;
    cornerAnchorPosition: Vec2;
    canvas: DOMRect;
    mouse: Vec2;

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
        this.canvas = this.baseCanvas.nativeElement.getBoundingClientRect();
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

    @HostListener('window:mousemove', ['$event'])
    resizeCanvas(event: MouseEvent) {
        if (this.mouseDown) {
            this.resize(event);
        } else if (!this.mouseDown) {
            this.stopResize(event);
        }
    }

    startResize(event: MouseEvent) {
        this.mouseDown = event.button === MouseButton.Left;
        this.drawingService.resizeActive = true;
    }

    resize(event: MouseEvent) {
        this.drawingService.resizeActive = true;

        if (this.mouseDown) {
            if (this.isBottom) {
                this.preview.y = event.pageY;
            } else if (this.isSide) {
                this.preview.x = event.pageX - (this.canvas.left + window.scrollY);
            } else if (this.isCorner) {
                this.preview.y = event.pageY;
                this.preview.x = event.pageX - (this.canvas.left + window.scrollY);
            }
        }
    }

    stopResize(event: MouseEvent) {
        this.copyCanvas(this.baseCanvas);

        if (this.isBottom) {
            this.canvasSize.y = this.preview.y;
            this.isBottom = false;
        } else if (this.isSide) {
            this.canvasSize.x = this.preview.x;
            this.isSide = false;
        } else if (this.isCorner) {
            this.canvasSize.x = this.preview.x;
            this.canvasSize.y = this.preview.y;
            this.isCorner = false;
        }

        this.mouseDown = false;
        this.relocateAnchors(event);
        this.drawingService.resizeActive = false;
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

    relocateAnchors(event: MouseEvent): void {
        this.sideAnchorPosition.y = this.canvasSize.y / 2;
        this.sideAnchorPosition.x = this.canvasSize.x;
        this.bottomAnchorPosition.y = this.canvasSize.y; // + (canvas.top + window.scrollY); // + (canvas.top - window.scrollY); //(canvas.top + window.scrollY);
        this.bottomAnchorPosition.x = this.canvasSize.x / 2;
        this.cornerAnchorPosition.y = this.canvasSize.y; //event.pageY - (canvas.top + window.scrollY);
        this.cornerAnchorPosition.x = this.canvasSize.x; //event.pageX - (canvas.left + window.scrollX);
    }
}
