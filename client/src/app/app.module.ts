import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { ColorPickerModule } from './color-picker.module';
import { AppComponent } from './components/app/app.component';
import { CarrouselComponent } from './components/carrousel/carrousel.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { MenuComponent } from './components/menu/menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ColorSliderComponent } from './components/color-picker/color-slider/color-slider.component';

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
        ColorPickerModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
