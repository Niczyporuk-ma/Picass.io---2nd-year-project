import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributesBarComponent } from './attributes-bar.component';

describe('AttributesBarComponent', () => {
    let component: AttributesBarComponent;
    let fixture: ComponentFixture<AttributesBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributesBarComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributesBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
