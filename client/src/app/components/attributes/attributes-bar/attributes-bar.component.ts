import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { ExportDrawingComponent } from '@app/components/export-drawing/export-drawing.component';
import { FormComponent } from '@app/components/form/form.component';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';
import { faAlignCenter, faAlignLeft, faAlignRight, faBold, faChevronDown, faDownload, faHome, faImages, faItalic, faSave, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

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
  faPlusSquare: IconDefinition = faPlusSquare;
  faDownload: IconDefinition = faDownload;
  faImages: IconDefinition = faImages;
  faSave: IconDefinition = faSave;
  faHome: IconDefinition = faHome;
  faChevronDown: IconDefinition = faChevronDown;
  shortcuts: ShortcutInput[] = [];

  constructor(public toolManager: ToolManagerService, public modal: MatDialog) { 
    this.toolManager = toolManager;
    // source: https://www.npmjs.com/package/ng-keyboard-shortcuts
    this.shortcuts.push(
      {
          key: 'ctrl + g',
          preventDefault: true,
          command: () => this.openCarousel(),
      },
      {
          key: 'ctrl + s',
          preventDefault: true,
          command: () => this.openSaveDrawingForm(),
      },
    );
    this.shortcuts.push({
        key: 'ctrl + e',
        preventDefault: true,
        command: () => this.export(),
    });
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

  export(): void {
    this.modal.open(ExportDrawingComponent);
  }

  openCarousel(): void {
      this.modal.open(CarrouselComponent);
  }

  openSaveDrawingForm(): void {
      this.modal.open(FormComponent);
  }

}
