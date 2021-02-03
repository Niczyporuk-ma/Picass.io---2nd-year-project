import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { CarrouselComponent } from './components/carrousel/carrousel.component';
import { ColorPaletteComponent } from './components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/color-picker/color-slider/color-slider.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { MenuComponent } from './components/menu/menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        MenuComponent,
        MenuCardComponent,
        CarrouselComponent,
        ToolbarComponent,
        ColorSliderComponent,
        ColorPaletteComponent,
        ColorPickerComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatListModule,
        MatCardModule,
        MatDividerModule,
        FontAwesomeModule,
        MatSliderModule,
        FormsModule,
        MatRadioModule,
        MatButtonToggleModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
