import { Injectable } from '@angular/core';
import { PencilService } from '@app/services/tools/pencil-service';

@Injectable({
  providedIn: 'root'
})
export class ToolManagerService {

  constructor(private pencilService : PencilService) 
  { }

  getPencilService () : PencilService 
  {
    return this.pencilService;
  }
}
