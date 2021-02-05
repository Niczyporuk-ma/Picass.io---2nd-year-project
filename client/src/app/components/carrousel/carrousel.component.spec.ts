import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CarrouselComponent } from './carrousel.component';

describe('CarrouselComponent', () => {
    let component: CarrouselComponent;
    let fixture: ComponentFixture<CarrouselComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CarrouselComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarrouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' ngOnInit should initialize visible to false', () => {
        component.ngOnInit();
        expect(component.visible).not.toEqual(true);
    });

    it(' toggleCarrousel should change visible from false to true', () => {
        component.ngOnInit();
        component.toggleCarrousel();
        expect(component.visible).toEqual(true);
    });
});
