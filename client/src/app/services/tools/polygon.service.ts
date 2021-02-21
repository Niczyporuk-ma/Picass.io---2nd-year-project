import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/enums/enums';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tools/color.service';
import { SquareHelperService } from '@app/services/tools/square-helper.service';


@Injectable({
  providedIn: 'root'
})
export class PolygonService extends Tool{

      startingPoint: Vec2;
      endPoint: Vec2;
      currentLine: Vec2[] = [];
      contour: boolean = true;
      sides : number = 3;
      premNumberOfSides : number = 3;
      showNumberOfSidesInput : boolean = false;

      constructor(drawingService: DrawingService, public colorService: ColorService, private squareHelper : SquareHelperService) 
      {
        super(drawingService);
        this.shortcut = '3';
        this.localShortcuts = new Map ();
        this.currentLine = [];
        this.index = 5;
        this.toolStyles = {
          primaryColor: 'rgba(255, 0, 0, 1)',
          lineWidth: 1,
          fill: false,
          secondaryColor: 'black',
        };

      }

    clearArrays(): void {
        this.currentLine = [];
    }

    setPreliminaryNumberOfSides(event : KeyboardEvent): void 
    {
      this.premNumberOfSides = parseInt((event.target as HTMLInputElement).value);
    }

    setNumberOfSides() : void 
    {
        if(this.premNumberOfSides >= 3 && this.premNumberOfSides <= 12){
          this.sides = this.premNumberOfSides;
        }else
        {
            alert("Veuillez inserer un nombre entre 3 et 12");
        }
    }

      onMouseDown(mouseDownEvent: MouseEvent): void {
        this.mouseDown = mouseDownEvent.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(mouseDownEvent);
            this.startingPoint = this.mouseDownCoord;
        }
      }

      onMouseUp(mouseUpEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive) {
          const mousePosition = this.getPositionFromMouse(mouseUpEvent);
          this.endPoint = mousePosition;
          this.drawingService.clearCanvas(this.drawingService.previewCtx);
          this.drawLine(this.drawingService.baseCtx, this.currentLine);
        }
        this.mouseDown = false;
      }

      onMouseMove(mouseMoveEvent: MouseEvent): void {
        if (this.mouseDown && !this.drawingService.resizeActive) {
            const mousePosition = this.getPositionFromMouse(mouseMoveEvent);
            this.endPoint = mousePosition;
            this.currentLine = [this.startingPoint, this.endPoint];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.currentLine);
        }
      }

      onButtonPress(): void 
      {
        this.showNumberOfSidesInput = !(this.showNumberOfSidesInput);
      }



      drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        //partie couleur
        this.setColors(this.colorService);
        this.setStyles();

        this.drawingService.previewCtx.fillStyle = this.toolStyles.primaryColor as string;
        this.drawingService.baseCtx.fillStyle = this.toolStyles.primaryColor as string;

        this.drawingService.previewCtx.strokeStyle = this.toolStyles.secondaryColor as string;
        this.drawingService.baseCtx.strokeStyle = this.toolStyles.secondaryColor as string;

        if (!this.contour) {
            ctx.strokeStyle = this.colorService.primaryColor;
        }

        //partie dessin
        ctx.beginPath();
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = this.toolStyles.lineWidth;
        ctx.lineCap = 'square';

        if (ctx === this.drawingService.baseCtx) {
            this.drawingService.drawingStarted = true;
        }

        const squareCornerPos : Vec2 = this.squareHelper.closestSquare([path[0], path[1]]);
        let centerX : number = (path[0].x + squareCornerPos.x)/2;
        let centerY: number = (path[0].y + squareCornerPos.y)/2;
        let angle : number = ((Math.PI*2)/this.sides);
        let radius :number = Math.abs((path[0].x - squareCornerPos.x) / 2);

        ctx.beginPath();

        ctx.moveTo (centerX +  radius * Math.cos(0), centerY);  // pour le mettre sur l'extremité du cercle

        for(let i = 1; i <= this.sides;i++ )
        {
          ctx.lineTo (centerX + radius * Math.cos(i * angle), centerY + radius * Math.sin(i * angle));
        }
       
        ctx.stroke();
        
        
        if (this.toolStyles.fill) {
            ctx.fill();
        }

        
    }

}
 