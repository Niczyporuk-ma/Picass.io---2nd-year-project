import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { KeyboardShortcutManagerService } from '@app/services/tools/keyboard-shortcut-manager.service';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
// import {DragDropModule} from '@angular/cdk/drag-drop';

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
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };
    // private previousX: number;
    // private previousY: number;
    // private newX: number;
    // private newY: number;

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

    // startResize(event: MouseEvent) {
    //     console.log('I got clicked!');
    //     this.previousX = event.clientX;
    //     this.previousY = event.clientY;
    //     console.log(this.previousX);
    //     console.log(this.previousY);

    //     bottomAnchor.addEventListener('mousemove', this.resize);
    //     bottomAnchor.addEventListener('mouseup', this.stopResize);
    // }

    // resize(event: MouseEvent) {
    //     const rect = bottomAnchor.getBoundingClientRect();

    //     this.newX = this.previousX - event.clientX;
    //     this.newY = this.previousY - event.clientY;
    //     console.log('new position' + this.newX);
    //     console.log('new position' + this.newY);
    //     const newValueX = String(rect.left - this.newX);
    //     const newValueY = String(rect.top - this.newY);

    //     bottomAnchor.setAttribute('left', newValueX + 'px');
    //     bottomAnchor.setAttribute('top', newValueY + 'px');

    //     this.canvasSize.y = this.canvasSize.y - this.newY;
    // }

    // stopResize() {
    //     window.removeEventListener('mousemove', this.resize);
    //     window.removeEventListener('mouseup', this.stopResize);
    // }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
