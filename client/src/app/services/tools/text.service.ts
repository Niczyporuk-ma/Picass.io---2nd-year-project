import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
//import { ColorService } from '@app/services/tools/color.service';
import { UndoRedoManagerService } from '@app/services/tools/undo-redo-manager.service';
//import { TextCommandService } from '@app/services/tools/tool-commands/text-command.service';

@Injectable({
  providedIn: 'root'
})
export class TextService extends Tool{
  //private colorService: ColorService;
  undoRedoManager: UndoRedoManagerService;
  font: string = "Courier New";
  fontSize: number = 30;
  isBold: boolean = false;
  isItalic: boolean = false;
  creatingTextBox: boolean = false;
  anchorPoints: Vec2[];
  mouseDown: boolean = false;
  startingPoint: Vec2;
  endPoint: Vec2;
  lastPos: Vec2 = { x: 0, y: 0 };
  currentLine: Vec2[] = [];
  hasBeenReset: boolean = false;
  textArray: string[] = [''];
  editingText: boolean = false;
  //cursorColumnIndex: number = 0;
  //cursorRowIndex: number = 0;
  alignment: CanvasTextAlign = "left"
  allowKeyPressEvents: boolean = true;
  isNotWriting: boolean = true;
  usefulKeys: string[] = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Backspace", "Enter", "Delete", "Escape", "Shift"];
  uselessKeys: string[] = ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "ScrollLock", "Pause", "Insert", "PageUp", "End", "PageDown", "ContextMenu", 
                            "Control", "Alt", "CapsLock", "Tab", "Meta"];
  cursorPosition: Vec2 = { x: 0, y: 0 }; //column idx = x, row idx = y

  constructor(drawingService: DrawingService, undoRedoManager: UndoRedoManagerService) { 
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
  }

  resetState(): void {
    this.anchorPoints = [];
    this.currentLine = [];
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    //TODO: print text on the base ctx;
    this.drawText(this.drawingService.baseCtx);
    this.undoRedoManager.undoStack.push(); //push text command 
    this.undoRedoManager.clearRedoStack();
    this.cursorPosition = { x: 0, y: 0 };
    this.hasBeenReset = true;
    this.creatingTextBox = false;
    this.isNotWriting = true;
    this.clearTextArray();
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

  clearTextArray(): void {
    this.textArray = [''];
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
      if (!this.creatingTextBox) {
        //this.imageData = this.getImageData();
      }
      // if (this.isMovingText) {
      //   //this.drawingService.baseCtx.putImageData(this.imageData, this.currentLine[0].x, this.currentLine[0].y);
      //   this.mouseDown = false;
      //   return;
      // }
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
  }

  drawText(ctx: CanvasRenderingContext2D): void {
    this.setStyles();
    for(let i  = 0; i < this.textArray.length; i++){
      ctx.textAlign = this.alignment;
      ctx.font = this.fontSize + "px " + this.font; 
      if(this.alignment === "left"){
        ctx.fillText(this.textArray[i], this.startingPoint.x, this.startingPoint.y + this.fontSize + (this.fontSize * i));
      }
      else{
        ctx.fillText(this.textArray[i], this.endPoint.x, this.startingPoint.y + this.fontSize + (this.fontSize * i));
      }
    }
    this.cursorPosition.x++;
    const cursorPosition: TextMetrics = this.drawingService.previewCtx.measureText(this.textArray[this.cursorPosition.y].substring(0, this.cursorPosition.x));
    if(cursorPosition.width >= this.endPoint.x - this.startingPoint.x - 13){ 
      this.cursorPosition.y++; 
      this.textArray[this.cursorPosition.y] = '';
    }
  }

  checkIfInUsefulKeys(key: string): boolean {
    for(const keys of this.usefulKeys) {
      if(key === keys) {return true};
    }
    return false;
  }
  checkIfInUselessKeys(key: string): boolean {
    for(const keys of this.uselessKeys) {
      if(key === keys) {return true};
    }
    return false;
  }

  onKeyDown(keydown: KeyboardEvent): void {
    if(!this.checkIfInUsefulKeys(keydown.key) && !(this.checkIfInUselessKeys(keydown.key))){
      this.textArray[this.cursorPosition.y] = this.textArray[this.cursorPosition.y].substring(0, this.cursorPosition.x) + keydown.key + 
      this.textArray[this.cursorPosition.y].substring(this.cursorPosition.x);
      this.drawCursor();
    }
    console.log(this.textArray);
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.drawTextBox(this.drawingService.previewCtx, this.currentLine);
    this.drawText(this.drawingService.previewCtx);
  }

  drawCursor(): void {
    //const cursorPosition: TextMetrics = this.drawingService.previewCtx.measureText(this.textArray[this.cursorPosition.y].substring(0, this.cursorPosition.x));
    this.drawingService.previewCtx.setLineDash([]);
    this.drawingService.previewCtx.beginPath();
    this.drawingService.previewCtx.moveTo(this.cursorPosition.x, this.cursorPosition.y);
    this.drawingService.previewCtx.lineTo(this.cursorPosition.x, this.cursorPosition.y + this.fontSize);
    this.drawingService.previewCtx.stroke();
  }

  // disableShortcut(): void {
  //   this.allowKeyPressEvents = false;
  // }

  // enableShortcut(): void {
  //   this.allowKeyPressEvents = true;
  // }

}