import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { Constant } from '@app/constants/general-constants-store';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizeService } from '@app/services/drawing/resize.service';
import { KeyboardShortcutManagerService } from '@app/services/tools/keyboard-shortcut-manager.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

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

    canvasSize: Vec2 = { x: Constant.DEFAULT_WIDTH, y: Constant.DEFAULT_HEIGHT };
    mouseDown: boolean = false;
    canvas: DOMRect;
    mouse: Vec2;
    resizeService: ResizeService;

    timeOutDuration: number = 170;

    // TODO : Avoir un service dédié pour gérer tous les outils ? Ceci peut devenir lourd avec le temps
    tools: Tool[];
    currentTool: Tool;
    shortcutKeyboardManager: KeyboardShortcutManagerService;
    toolManager: ToolManagerService;
    clickCount: number = 0;
    constructor(
        private drawingService: DrawingService,
        toolManager: ToolManagerService,
        keyboardManager: KeyboardShortcutManagerService,
        resizeService: ResizeService,
    ) {
        this.resizeService = resizeService;
        this.toolManager = toolManager;
        this.tools = toolManager.tools;
        this.shortcutKeyboardManager = keyboardManager;
        this.toolManager.currentToolChange.subscribe((value) => (this.currentTool = value));
        this.currentTool = this.toolManager.currentTool;
        this.resizeService.bottomAnchorPosition = { x: this.canvasSize.x / 2, y: this.canvasSize.y };
        this.resizeService.sideAnchorPosition = { x: this.canvasSize.x, y: this.canvasSize.y / 2 };
        this.resizeService.cornerAnchorPosition = { x: this.canvasSize.x, y: this.canvasSize.y };
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

    @HostListener('window:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.resizeService.mouseDown) {
            this.resizeService.resize(event, this.canvas);
        } else {
            this.currentTool.onMouseMove(event);
        }
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

    @HostListener('window:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        if (this.resizeService.mouseDown) {
            this.resizeService.stopResize(event, this.canvasSize, this.baseCanvas);
        } else {
            this.currentTool.onMouseUp(event);
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
