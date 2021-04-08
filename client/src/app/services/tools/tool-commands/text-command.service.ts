import { Injectable } from '@angular/core';
import { UndoRedoCommand } from '@app/classes/undo-redo-command';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
  providedIn: 'root'
})
export class TextCommandService extends UndoRedoCommand{
  font: string = 'Times New Roman'
  textArray: string[] = [''];
  alignment: CanvasTextAlign = 'left';
  startingPoint: Vec2 = {x: 0, y: 0};
  endPoint: Vec2 = {x: 0, y: 0};
  constructor() { 
    super();
    this.toolStyle = {
      primaryColor: 'black',
      lineWidth: 30
    }
  }

  setTextAttributes(fontSize: number, font: string, textArray: string[], alignment: CanvasTextAlign, startingPoint: Vec2, endPoint: Vec2, primaryColor: string): void {
    this.toolStyle.lineWidth = fontSize;
    this.font = font;
    this.textArray = Object.assign([], textArray);
    this.alignment = alignment;
    this.startingPoint = {x: startingPoint.x, y: startingPoint.y};
    this.endPoint = {x: endPoint.x, y: endPoint.y};
    this.toolStyle.primaryColor = primaryColor;
  }

  execute(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.toolStyle.primaryColor;
    ctx.globalCompositeOperation = 'source-over';
    for(let i  = 0; i < this.textArray.length; i++){
      ctx.textAlign = this.alignment;
      ctx.font = this.toolStyle.lineWidth + "px " + this.font; 
      if(this.alignment === "left"){
        ctx.fillText(this.textArray[i], this.startingPoint.x, this.startingPoint.y + this.toolStyle.lineWidth + (this.toolStyle.lineWidth * i));
      }
      else if (this.alignment === "right") {
        ctx.fillText(this.textArray[i], this.endPoint.x, this.startingPoint.y + this.toolStyle.lineWidth + (this.toolStyle.lineWidth * i));
      }
      else if (this.alignment === "center") {
        ctx.fillText(this.textArray[i], ((this.endPoint.x - this.startingPoint.x)/2) + 
        this.startingPoint.x, this.startingPoint.y + 
        this.toolStyle.lineWidth + 
        (this.toolStyle.lineWidth * i));
      }
    }
  }
}
