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
// const bottomAnchor = document.querySelector('bottomAnchor') as Element;

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
    private copyCtx: CanvasRenderingContext2D;

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
        this.copyCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
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
        this.copyCtx = this.drawingService.baseCtx;
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.previewCtx.setLineDash([5, 5]);
            this.previewCtx.beginPath();
            if (this.isBottom) {
                console.log('bottom anchor:' + document.getElementById('bottomAnchor'));
                this.previewCtx.moveTo(0, event.clientY);
                this.previewCtx.lineTo(1000, event.clientY);
            } else if (this.isSide) {
                console.log('side anchor:' + document.getElementById('sideAnchor'));
                this.previewCtx.moveTo(event.clientX, 0);
                this.previewCtx.lineTo(event.clientX, 800);
            } else if (this.isCorner) {
                console.log('corner anchor:' + document.getElementById('cornerAnchor'));
                this.previewCtx.moveTo(event.clientX, event.clientX);
                this.previewCtx.lineTo(event.clientX, event.clientX);
            }
            this.previewCtx.stroke();
        }
    }

    resize(event: MouseEvent) {
        if (this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.previewCtx.setLineDash([5, 5]);
            this.previewCtx.beginPath();
            if (this.isBottom) {
                console.log('bottom');
                this.previewCtx.moveTo(0, event.clientY);
                this.previewCtx.lineTo(1000, event.clientY);
            } else if (this.isSide) {
                console.log('side');
                this.previewCtx.moveTo(event.clientX - 518, 0);
                this.previewCtx.lineTo(event.clientX - 518, 800);
            } else if (this.isCorner) {
                console.log('corner');
                //dash vertical
                this.previewCtx.moveTo(event.clientX - 518, 0);
                this.previewCtx.lineTo(event.clientX - 518, event.clientY);
                //Dash horizontal
                this.previewCtx.moveTo(0, event.clientY);
                this.previewCtx.lineTo(event.clientX - 518, event.clientY);
            }
            this.previewCtx.stroke();
        }
    }

    stopResize(event: MouseEvent) {
        this.mouseDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        if (this.isBottom) {
            this.canvasSize.y = event.clientY;
        } else if (this.isSide) {
            this.canvasSize.x = event.clientX - 518;
            console.log('stop resize: end position : ' + event.clientX);
        } else if (this.isCorner) {
            this.canvasSize.x = event.clientX - 518;
            this.canvasSize.y = event.clientY;
        }

        this.isBottom = false;
        this.isCorner = false;
        this.isSide = false;
        this.drawingService.baseCtx = this.copyCtx;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
