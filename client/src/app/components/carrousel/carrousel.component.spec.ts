import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CarrouselComponent } from './carrousel.component';

describe('CarrouselComponent', () => {
    let component: CarrouselComponent;
    let fixture: ComponentFixture<CarrouselComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CarrouselComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [HttpHandler, HttpClient],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarrouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        /* tslint:disable */
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

    it('updateDataFiltered should call splice() on datFiltered when the id is matching', () => {
        component.dataFiltered = [{_id: "myID", name:"name1", tags : ["tag1"]}, 
                                    {_id: "myID2", name:"name2", tags : ["tag2"]}];
        let spliceSpy = spyOn(component.dataFiltered,'splice');
        component.filterService.id = "myID";
        component.updateDataFiltered();
        expect(spliceSpy).toHaveBeenCalledWith(0,1);
        expect(spliceSpy).not.toHaveBeenCalledWith(1,1);

    });

    it('getDrawings should call BasicGet', () => {
        let basicGetSpy = spyOn(component['indexService'],'basicGet').and.returnValue(of([]));
        spyOn(component.filterService,'filteringToGet').and.returnValue();
        component.dataFiltered = [];
        component.getDrawings();
        expect(basicGetSpy).toHaveBeenCalled();
    });

    it('filteringDrawings should set isErrorGetting to true when datafiltered is empty',()=>{
        spyOn(component.filterService,'filteringToGet').and.returnValue();
        component.dataFiltered = [];
        component.filterDrawings();
        expect(component.isErrorGetting).toEqual(true);
    });

    it('filteringDrawings should set isPossibleToDelete to true when datafiltered isnt empty',()=>{
        spyOn(component.filterService,'filteringToGet').and.returnValue();
        component.dataFiltered = [{_id:"", name:"", tags: []}];
        component.filterDrawings();
        expect(component.isPossibleToDelete).toEqual(true);
    });

    it("deleteDrawings should call basicDelete", () => {
        let basicdeleteSpy = spyOn(component['indexService'],'basicDelete').and.returnValue(of());
        component.deleteDrawings();
        expect(basicdeleteSpy).toHaveBeenCalled();
    });


});
