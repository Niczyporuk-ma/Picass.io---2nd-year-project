import { Injectable } from '@angular/core';
import { ToolManagerService } from '@app/services/tools/tool-manager.service';

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutManagerService {

   currentCommand : Function = () => {};
    
  
  constructor(private toolManagerService : ToolManagerService ) {
    this.toolManagerService.test.subscribe((value) => (console.log(value + "jjjjjjjjjjjjjjjjjjjjjjj"));
   }

   onKeyPress(key: string): void {
    if (this.toolManagerService.getCurrentTool().getLocalShorcuts().has(key)) {
        this.toolManagerService.test.next (<Function>this.toolManagerService.getCurrentTool().getLocalShorcuts().get(key));
        this.currentCommand();
    } else {
        if (this.toolManagerService.toolBoxShortcuts.has(key)) {
            console.log("elle m'a bien khalass");
            this.toolManagerService.test.next(<Function>this.toolManagerService.toolBoxShortcuts.get(key));
            console.log(this.toolManagerService.toolBoxShortcuts.get(key));
            
            this.currentCommand();
            console.log(this.currentCommand);
        }  
    }
}
}
