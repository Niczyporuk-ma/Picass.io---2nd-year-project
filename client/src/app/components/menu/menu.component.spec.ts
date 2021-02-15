import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrouselComponent } from '../carrousel/carrousel.component';
import { MenuComponent } from './menu.component';

fdescribe('MenuComponent', () => {
    let component: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuComponent,CarrouselComponent],
            schemas : [CUSTOM_ELEMENTS_SCHEMA],

        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' isStarted should return the right boolean value ', () => {
        const drawingState: boolean = component.isStarted();
        expect(drawingState).toEqual(component.drawingService.drawingStarted);
    });
});
