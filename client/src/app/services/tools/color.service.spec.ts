import { TestBed } from '@angular/core/testing';
import { ColorService } from './color.service';

describe('ColorService', () => {
    let service: ColorService;

    beforeEach(() => {
        // tslint:disable:no-magic-numbers

        TestBed.configureTestingModule({});
        service = TestBed.inject(ColorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setPrimaryColorWithOpacity updates the opacity of the primary color', () => {
        service.primaryColor = 'rgba(255,255,255,1)';
        service.setPrimaryColorWithOpacity(0.5);
        expect(service.primaryColor).toEqual('rgba(255,255,255,0.5)');
    });

    it('setSecondary ColorWithOpacity updates the opacity of the secondary color', () => {
        service.secondaryColor = 'rgba(255,255,255,1)';
        service.setSecondaryColorWithOpacity(0.5);
        expect(service.secondaryColor).toEqual('rgba(255,255,255,0.5)');
    });

    it('swapPrimaryAndSecondary inverts the primary and the secondary colors', () => {
        service.primaryColor = 'rgba(0,0,0,1)';
        service.secondaryColor = 'rgba(255,255,255,1)';
        service.swapPrimaryAndSecondary();
        expect(service.primaryColor).toEqual('rgba(255,255,255,1)');
        expect(service.secondaryColor).toEqual('rgba(0,0,0,1)');
    });

    it('setColorWithOpacity should return the right string with color and opacity', () =>{
        const mockColor : string = 'rgba(1,2,3,4)';
        const mockOpacity : number = 1;
        const expectedResult : string = 'rgba(1,2,3,1)'
        const result = service.setColorWithOpacity(mockColor,mockOpacity);
        expect(result).toEqual(expectedResult);
    })
});
