import { Injectable } from '@angular/core';
import { ToolManagerService } from './tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ToolselectorService {

  constructor(private toolManager : ToolManagerService) {
   }

  test() : void {
    return this.toolManager.
  }
}
