import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuComponent } from '../menu/menu.component';
import { MenuCardComponent } from './menu-card.component';


fdescribe('MenuCardComponent', () => {
    let component: MenuCardComponent;
    let fixture: ComponentFixture<MenuCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MenuCardComponent,MenuCardComponent,MenuComponent],
            schemas : [CUSTOM_ELEMENTS_SCHEMA],

        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
