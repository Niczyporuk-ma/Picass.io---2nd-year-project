import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';

fdescribe('ColorService', () => {
    let service: ColorService;

    beforeEach(() => {
        // tslint:disable:no-magic-numbers

        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('setPrimaryColorWithOpacity updates the opacity of the primary color', () => {
    //     service.primaryColor = 'rgba(255,255,255,1)';
    //     service.setPrimaryColorWithOpacity(0.5);
    //     expect(service.primaryColor).toEqual('rgba(255,255,255,0.5)');
    // });

    // it('setSecondary ColorWithOpacity updates the opacity of the secondary color', () => {
    //     service.secondaryColor = 'rgba(255,255,255,1)';
    //     service.setSecondaryColorWithOpacity(0.5);
    //     expect(service.secondaryColor).toEqual('rgba(255,255,255,0.5)');
    // });

    // it('swapPrimaryAndSecondary inverts the primary and the secondary colors', () => {
    //     service.primaryColor = 'rgba(0,0,0,1)';
    //     service.secondaryColor = 'rgba(255,255,255,1)';
    //     service.swapPrimaryAndSecondary();
    //     expect(service.primaryColor).toEqual('rgba(255,255,255,1)');
    //     expect(service.secondaryColor).toEqual('rgba(0,0,0,1)');
    // });

    it('setColorWithOpacity should return the right string with color and opacity', () =>{
        const mockColor : string = 'rgba(1,2,3,4)';
        const mockOpacity : number = 1;
        const expectedResult : string = 'rgba(1,2,3,1)'
        const result = service.setColorWithOpacity(mockColor,mockOpacity);
        expect(result).toEqual(expectedResult);
    })

    it('resetValuesOnCancel correctly sets the right values',() =>{
        service.primaryColorPreview = 'rgba(0,0,0,0)';
        service.primaryColor = 'rgba(1,1,1,1)'
        service.secondaryColorPreview = 'rgba(1,2,3,4)';
        service.secondaryColor = 'rgba(1,1,1,2)';
        service.primaryOpacityPreview = 2;
        service.primaryOpacity = 1;
        service.secondaryOpacityPreview = 3;
        service.secondaryOpacity = 4;

        service.resetValuesOnCancel();

        expect(service.primaryColorPreview).toEqual(service.primaryColor);
        expect(service.secondaryColorPreview).toEqual(service.secondaryColor);
        expect(service.primaryOpacityPreview).toEqual(service.primaryOpacity);
        expect(service.secondaryOpacityPreview).toEqual(service.secondaryOpacity);
    })

    it('setValuesOnConfirm calls setColorWithOpacity 4 times', ()=>{
        const setColorWithOpacitySpy = spyOn(service,'setColorWithOpacity').and.stub();
        service.setValuesOnConfirm();
        expect(setColorWithOpacitySpy).toHaveBeenCalledTimes(4);
    })

    it('setValuesOnConfirm calls pushToQueueOnConfirm 2 times if both ifs are true',()=>{
        const pushToQueueOnConfirmSpy = spyOn(service,'pushToQueueOnConfirm').and.stub();
        service.primaryColor = 'rgba(1,1,1,1)';
        service.primaryColorPreview = 'rgba(1,2,3,1)';
        service.secondaryColor = 'rgba(1,1,1,1)';
        service.secondaryColorPreview = 'rgba(1,2,3,1)';

        service.setValuesOnConfirm();
        expect(pushToQueueOnConfirmSpy).toHaveBeenCalledTimes(2);

    })

    it('setValuesOnConfirm calls pushToQueueOnConfirm once if only 1st if is true',()=>{
        const pushToQueueOnConfirmSpy = spyOn(service,'pushToQueueOnConfirm').and.stub();
        service.primaryColor = 'rgba(1,1,1,1)';
        service.primaryColorPreview = 'rgba(1,1,1,1)';
        service.secondaryColor = 'rgba(1,1,1,1)';
        service.secondaryColorPreview = 'rgba(1,2,3,1)';

        service.setValuesOnConfirm();
        expect(pushToQueueOnConfirmSpy).toHaveBeenCalledTimes(1);

    })

    it('setValuesOnConfirm calls pushToQueueOnConfirm once if only 2nd if is true', () => {
        const pushToQueueOnConfirmSpy = spyOn(service,'pushToQueueOnConfirm').and.stub();

        service.primaryColor = 'rgba(1,1,1,1)';
        service.primaryColorPreview = 'rgba(1,2,1,1)';
        service.secondaryColor = 'rgba(1,1,1,1)';
        service.secondaryColorPreview = 'rgba(1,1,1,1)';

        service.setValuesOnConfirm();
        expect(pushToQueueOnConfirmSpy).toHaveBeenCalledTimes(1);
    })
});
