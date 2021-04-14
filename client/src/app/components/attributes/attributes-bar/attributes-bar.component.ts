import { Component, OnInit } from '@angular/core';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { faAlignCenter, faAlignLeft, faAlignRight, faBold, faItalic, IconDefinition } from '@fortawesome/free-solid-svg-icons';

const FILL_VALUE = '1';
const CONTOUR_VALUE = '2';

@Component({
  selector: 'app-attributes-bar',
  templateUrl: './attributes-bar.component.html',
  styleUrls: ['./attributes-bar.component.scss']
})
export class AttributesBarComponent implements OnInit {

  faAlignCenter: IconDefinition = faAlignCenter;
  faAlignLeft: IconDefinition = faAlignLeft;
  faAlignRight: IconDefinition = faAlignRight;
  faBold : IconDefinition = faBold;
  faItalic : IconDefinition = faItalic;

  constructor(public toolManager: ToolManagerService) { 
    this.toolManager = toolManager;
  }

  ngOnInit(): void {
  }

  changeWidth(width: number): void {
    this.toolManager.currentTool.changeWidth(width);
    this.toolManager.widthValue = this.toolManager.currentTool.toolStyles.lineWidth;
  }

  changeEmissionRate(rate: number): void {
    this.toolManager.airbrushService.emissionRate = rate;
  }

  changeJetDiameter(diameter: number): void {
      this.toolManager.airbrushService.jetDiameter = diameter;
  }
  
  changeDropletDiameter(diameter: number): void {
      this.toolManager.airbrushService.dropletDiameter = diameter;
  }

  setRectangleStyle(recStyleCode: string): void {
    if (recStyleCode === FILL_VALUE) {
        this.toolManager.rectangleService.toolStyles.fill = true;
        this.toolManager.rectangleService.contour = false;
    } else if (recStyleCode === CONTOUR_VALUE) {
        this.toolManager.rectangleService.toolStyles.fill = false;
        this.toolManager.rectangleService.contour = true;
    } else {
        this.toolManager.rectangleService.toolStyles.fill = true;
        this.toolManager.rectangleService.contour = true;
    }
  }

  setEllipseStyle(ellipseStyleCode: string): void {
    if (ellipseStyleCode === FILL_VALUE) {
        this.toolManager.ellipseService.toolStyles.fill = true;
        this.toolManager.ellipseService.border = false;
    } else if (ellipseStyleCode === CONTOUR_VALUE) {
        this.toolManager.ellipseService.toolStyles.fill = false;
        this.toolManager.ellipseService.border = true;
    } else {
        this.toolManager.ellipseService.toolStyles.fill = true;
        this.toolManager.ellipseService.border = true;
    }
  }

  setPolygonStyle(polyStyleCode: string): void {
    if (polyStyleCode === FILL_VALUE) {
        this.toolManager.polygonService.toolStyles.fill = true;
        this.toolManager.polygonService.contour = false;
    } else if (polyStyleCode === CONTOUR_VALUE) {
        this.toolManager.polygonService.toolStyles.fill = false;
        this.toolManager.polygonService.contour = true;
    } else {
        this.toolManager.polygonService.toolStyles.fill = true;
        this.toolManager.polygonService.contour = true;
    }
  }

  setLineJunction(n: string): void {
      if (n === '0') {
          this.toolManager.lineService.hasJunction = false;
      } else {
          this.toolManager.lineService.hasJunction = true;
      }
  }
  
  changeDiameter(newDiameter: number): void {
      this.toolManager.lineService.currentDiameter = newDiameter;
  }

}
