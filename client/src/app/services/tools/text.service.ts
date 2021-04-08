import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextCommandService } from '@app/services/tools/tool-commands/text-command.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';
import { ColorService } from './color.service';

@Injectable({
  providedIn: 'root'
})
export class TextService extends Tool{
  undoRedoManager: UndoRedoManagerService;
  colorService: ColorService;
  font: string = "Arial";
  fontSize: number = 30;
  isBold: boolean = false;
  isItalic: boolean = false;
  creatingTextBox: boolean = false;
  anchorPoints: Vec2[];
  mouseDown: boolean = false;
  startingPoint: Vec2 = { x: 0, y: 0 };;
  endPoint: Vec2 = { x: 0, y: 0 };;
  lastPos: Vec2 = { x: 0, y: 0 };
  currentLine: Vec2[] = [];
  hasBeenReset: boolean = false;
  textArray: string[] = [''];
  editingText: boolean = false;
  alignment: CanvasTextAlign = "left"
  allowKeyPressEvents: boolean = true;
  isNotWriting: boolean = true;
  textBoxActive: boolean = false;
  usefulKeys: string[] = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Backspace", "Enter", "Delete", "Escape", "Shift"];
  uselessKeys: string[] = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "ScrollLock", "Pause", "Insert", "PageUp", "End", "PageDown", "ContextMenu", 
                            "Control", "Alt", "CapsLock", "Tab", "Meta"];
  cursorPosition: Vec2 = { x: 0, y: 0 }; //column idx = x, row idx = y

  constructor(drawingService: DrawingService, undoRedoManager: UndoRedoManagerService, colorService: ColorService) { 
    super(drawingService);
    this.undoRedoManager = undoRedoManager;
    this.toolStyles = {
      primaryColor: 'black',
      lineWidth: this.fontSize,
      fill: true,
      secondaryColor: 'black',
    }
    this.shortcut = 't';
    this.index = 10;
    this.colorService = colorService;
  }
  
  changeFontSize(size: number) {
    this.fontSize = size;
  }

  resetState(): void {
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    let textCommand: TextCommandService = new TextCommandService();
    this.drawText(this.drawingService.baseCtx, textCommand);
    this.undoRedoManager.undoStack.push(textCommand); //push text command 
    this.undoRedoManager.clearRedoStack();
    this.cursorPosition = { x: 0, y: 0 };
    this.hasBeenReset = true;
    this.creatingTextBox = false;
    this.isNotWriting = true;
    this.clearArrays();
    this.textBoxActive = false;
  }
  
  checkIfInsideRectangle(event: MouseEvent): boolean {
    const CLICK_COORDS: Vec2 = { x: event.offsetX, y: event.offsetY };
    const X = CLICK_COORDS.x;
    const Y = CLICK_COORDS.y;
    const MIN_X = this.currentLine[0].x;
    const MIN_Y = this.currentLine[0].y;
    const MAX_X = this.currentLine[1].x;
    const MAX_Y = this.currentLine[1].y;
    return X >= MIN_X && X <= MAX_X && Y >= MIN_Y && Y <= MAX_Y;
  }

  clearArrays(): void {
    this.textArray = [''];
    this.currentLine = [];
  }
  
  onMouseDown(mouseDownEvent: MouseEvent): void {
    this.mouseDown = mouseDownEvent.button === MouseButton.Left;
    if (this.mouseDown) {
      this.undoRedoManager.disableUndoRedo();
      if (this.currentLine.length > 0) {
        if (!this.checkIfInsideRectangle(mouseDownEvent)) {
          this.resetState();
          return;
        }
        this.lastPos = this.getPositionFromMouse(mouseDownEvent);
        this.isNotWriting = false;
        return;
      }
      this.anchorPoints = [];
      this.mouseDownCoord = this.getPositionFromMouse(mouseDownEvent);
      this.startingPoint = this.mouseDownCoord;
    }
  }

  onMouseMove(mouseMoveEvent: MouseEvent): void {
    if (this.mouseDown && !this.drawingService.resizeActive && !this.hasBeenReset) {
      this.undoRedoManager.disableUndoRedo();
      this.hasBeenReset = false;
      const mousePosition = this.getPositionFromMouse(mouseMoveEvent);
      this.endPoint = mousePosition;
      this.currentLine = [this.startingPoint, this.endPoint];
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.drawTextBox(this.drawingService.previewCtx, this.currentLine);
    }
  }

  onMouseUp(mouseUpEvent: MouseEvent): void {
    if (this.mouseDown && !this.drawingService.resizeActive) {
      this.undoRedoManager.enableUndoRedo();
      if (this.hasBeenReset) {
        this.hasBeenReset = false;
        this.mouseDown = false;
        return;
      }
      const mousePosition = this.getPositionFromMouse(mouseUpEvent);
      this.endPoint = mousePosition;
      this.currentLine = [this.startingPoint, this.endPoint];
      this.lastPos.x = mouseUpEvent.offsetX;
      this.lastPos.y = mouseUpEvent.offsetY;
      this.mouseDown = false;
    }
  }

  drawTextBox(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
    ctx.fillStyle = 'white';
    ctx.setLineDash([5, 5])
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 1;
    ctx.lineCap = 'square';
    ctx.strokeStyle = 'black';
    ctx.strokeRect(path[0].x, path[0].y, path[1].x - path[0].x, path[1].y - path[0].y);
    ctx.closePath();
    this.textBoxActive = true;
  }

  enterKey(keyboardEvent: KeyboardEvent): void {
    if(keyboardEvent.key === "Enter" && this.textBoxActive){
      this.cursorPosition.y++; 
      this.textArray[this.cursorPosition.y] = '';
    }
  }

  escapeKey(keyboardEvent: KeyboardEvent): void {
    if(keyboardEvent.key === "Escape" && this.textBoxActive){
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.textBoxActive = false;
      this.clearArrays();
    }
  }

  arrowUp(keyboardEvent: KeyboardEvent): void { //BROKEN
    if(keyboardEvent.key === "ArrowUp" && this.cursorPosition.y > 0 && this.textBoxActive){
      this.cursorPosition.y--;
    }
  }

  arrowDown(keyboardEvent: KeyboardEvent): void { //BROKEN
    if(keyboardEvent.key === "ArrowDown" && this.cursorPosition.y < this.textArray.length && this.textBoxActive){
      this.cursorPosition.y++;
    }
  }

  arrowLeft(keyboardEvent: KeyboardEvent): void { //BROKEN
    if(keyboardEvent.key === "ArrowLeft" && this.cursorPosition.x > 0 && this.textBoxActive){
      this.cursorPosition.x--;
    }
  }

  arrowRight(keyboardEvent: KeyboardEvent): void { //BROKEN
    if(keyboardEvent.key === "ArrowRight" && this.cursorPosition.y < this.textArray.length && this.textBoxActive){
      this.cursorPosition.x++;
    }
  }

  switchStartingAndEndPoints(): void {
    if(this.startingPoint.x > this.endPoint.x){
      const tempPoint: Vec2 = {x: this.startingPoint.x, y: this.startingPoint.y};
      this.startingPoint = {x: this.endPoint.x, y: this.endPoint.y};
      this.endPoint = {x: tempPoint.x, y: tempPoint.y};
    }
    if(this.startingPoint.y > this.endPoint.y){
      const tempPoint: Vec2 = {x: this.startingPoint.x, y: this.startingPoint.y};
      this.startingPoint = {x: this.startingPoint.x, y: this.endPoint.y};
      this.endPoint = {x: this.endPoint.x, y: tempPoint.y};
    }
  }

  drawText(ctx: CanvasRenderingContext2D, textCommand: TextCommandService): void {
    this.setColors(this.colorService);
    this.switchStartingAndEndPoints();
    textCommand.setTextAttributes(this.fontSize, this.font, this.textArray, this.alignment, this.startingPoint, this.endPoint, this.colorService.primaryColor);
    textCommand.execute(ctx);
    this.cursorPosition.x++;
    // const cursorPosition: TextMetrics = this.drawingService.previewCtx.measureText(this.textArray[this.cursorPosition.y].substring(0, this.cursorPosition.x));
    // if(cursorPosition.width >= this.endPoint.x - this.startingPoint.x - 13){ 
    //   this.cursorPosition.y++; 
    //   this.textArray[this.cursorPosition.y] = '';
    //}
  }

  checkIfInKeyArray(key: string, array: string[]): boolean {
    for(const keys of array) {
      if(key === keys) {return true};
    }
    return false;
  }

  onKeyDown(keydown: KeyboardEvent): void {
    if(this.textBoxActive){
      if(!this.checkIfInKeyArray(keydown.key, this.usefulKeys) && !(this.checkIfInKeyArray(keydown.key, this.uselessKeys))){
        this.textArray[this.cursorPosition.y] = this.textArray[this.cursorPosition.y].substring(0, this.cursorPosition.x) + keydown.key + 
        this.textArray[this.cursorPosition.y].substring(this.cursorPosition.x);
        this.drawCursor();
      }
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.drawTextBox(this.drawingService.previewCtx, this.currentLine);
      let textCommand: TextCommandService = new TextCommandService();
      this.drawText(this.drawingService.previewCtx, textCommand);
    }
  }

  drawCursor(): void {
    //const cursorPosition: TextMetrics = this.drawingService.previewCtx.measureText(this.textArray[this.cursorPosition.y].substring(0, this.cursorPosition.x));
    this.drawingService.previewCtx.setLineDash([]);
    this.drawingService.previewCtx.beginPath();
    this.drawingService.previewCtx.moveTo(this.cursorPosition.x, this.cursorPosition.y);
    this.drawingService.previewCtx.lineTo(this.cursorPosition.x, this.cursorPosition.y + this.fontSize);
    this.drawingService.previewCtx.stroke();
  }
}