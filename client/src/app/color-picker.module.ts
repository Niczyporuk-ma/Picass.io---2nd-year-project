import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ColorPickerComponent],
    exports: [ColorPickerComponent],
})
export class ColorPickerModule {}
