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

    it('setPrimaryColorWithOpacity updates the opacity of the primary color', () => {
        service.primaryColorPreview = 'rgba(255,255,255,1)';
        service.setPrimaryColorWithOpacity(0.5);
        expect(service.primaryColorPreview).toEqual('rgba(255,255,255,0.5)');
    });

    it('setSecondary ColorWithOpacity updates the opacity of the secondary color', () => {
        service.secondaryColorPreview = 'rgba(255,255,255,1)';
        service.setSecondaryColorWithOpacity(0.5);
        expect(service.secondaryColorPreview).toEqual('rgba(255,255,255,0.5)');
    });

    it('swapPrimaryAndSecondary inverts the primary and the secondary colors', () => {
        service.primaryColorPreview = 'rgba(0,0,0,1)';
        service.secondaryColorPreview = 'rgba(255,255,255,1)';
        service.swapPrimaryAndSecondary();
        expect(service.primaryColorPreview).toEqual('rgba(255,255,255,1)');
        expect(service.secondaryColorPreview).toEqual('rgba(0,0,0,1)');
    });

    it('setColorWithOpacity should return the right string with color and opacity', () => {
        const mockColor: string = 'rgba(1,2,3,4)';
        const mockOpacity: number = 1;
        const expectedResult: string = 'rgba(1,2,3,1)';
        const result = service.setColorWithOpacity(mockColor, mockOpacity);
        expect(result).toEqual(expectedResult);
    });

    it('resetValuesOnCancel correctly sets the right values', () => {
        service.primaryColorPreview = 'rgba(0,0,0,0)';
        service.primaryColor = 'rgba(1,1,1,1)';
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
    });

    it('setValuesOnConfirm calls setColorWithOpacity 4 times', () => {
        const setColorWithOpacitySpy = spyOn(service, 'setColorWithOpacity').and.stub();
        service.setValuesOnConfirm();
        expect(setColorWithOpacitySpy).toHaveBeenCalledTimes(4);
    });

    it('setValuesOnConfirm calls pushToQueueOnConfirm 2 times if both ifs are true', () => {
        const pushToQueueOnConfirmSpy = spyOn(service, 'pushToQueueOnConfirm').and.stub();
        service.primaryColor = 'rgba(1,1,1,1)';
        service.primaryColorPreview = 'rgba(1,2,3,1)';
        service.secondaryColor = 'rgba(1,1,1,1)';
        service.secondaryColorPreview = 'rgba(1,2,3,1)';

        service.setValuesOnConfirm();
        expect(pushToQueueOnConfirmSpy).toHaveBeenCalledTimes(2);
    });

    it('setValuesOnConfirm calls pushToQueueOnConfirm once if only 1st if is true', () => {
        const pushToQueueOnConfirmSpy = spyOn(service, 'pushToQueueOnConfirm').and.stub();
        service.primaryColor = 'rgba(1,1,1,1)';
        service.primaryColorPreview = 'rgba(1,1,1,1)';
        service.secondaryColor = 'rgba(1,1,1,1)';
        service.secondaryColorPreview = 'rgba(1,2,3,1)';

        service.setValuesOnConfirm();
        expect(pushToQueueOnConfirmSpy).toHaveBeenCalledTimes(1);
    });

    it('setValuesOnConfirm calls pushToQueueOnConfirm once if only 2nd if is true', () => {
        const pushToQueueOnConfirmSpy = spyOn(service, 'pushToQueueOnConfirm').and.stub();

        service.primaryColor = 'rgba(1,1,1,1)';
        service.primaryColorPreview = 'rgba(1,2,1,1)';
        service.secondaryColor = 'rgba(1,1,1,1)';
        service.secondaryColorPreview = 'rgba(1,1,1,1)';

        service.setValuesOnConfirm();
        expect(pushToQueueOnConfirmSpy).toHaveBeenCalledTimes(1);
    });

    it('contains should call toArray once', () => {
        let toArraySpy = spyOn<any>(service.tenLastUsedColors, 'toArray').and.callThrough();
        let color = 'black' as string;
        service.contains(color);
        expect(toArraySpy).toHaveBeenCalledTimes(1);
    });

    it('contains should return false if there is nothing in tenLastUsedColors', () => {
        let color = 'grey' as string;
        expect(service.contains(color)).toEqual(false);
    });

    it('contains should return true when the last color in the queue of string is blue', () => {
        let color = 'blue' as string;
        service.tenLastUsedColors.append('black');
        service.tenLastUsedColors.append('grey');
        service.tenLastUsedColors.append('red');
        service.tenLastUsedColors.append('blue');
        expect(service.contains(color)).toEqual(true);
    });

    it('contains should return true when the color grey is in the middle of the queue of string', () => {
        let color = 'grey' as string;
        service.tenLastUsedColors.append('yellow');
        service.tenLastUsedColors.append('grey');
        service.tenLastUsedColors.append('blue');
        service.tenLastUsedColors.append('red');
        expect(service.contains(color)).toEqual(true);
    });

    it('contains should return true when the color yellow is at the start of the queue of string', () => {
        let color = 'yellow' as string;
        service.tenLastUsedColors.append('yellow');
        service.tenLastUsedColors.append('grey');
        service.tenLastUsedColors.append('blue');
        service.tenLastUsedColors.append('red');
        expect(service.contains(color)).toEqual(true);
    });

    it('pushToQueueOnConfirm should call append once when tenLastUsedColors does not have the color grey', () => {
        let color = 'grey' as string;

        service.tenLastUsedColors.append('yellow');
        service.tenLastUsedColors.append('black');
        service.tenLastUsedColors.append('blue');
        service.tenLastUsedColors.append('red');

        let appendSpy = spyOn<any>(service.tenLastUsedColors, 'append').and.callThrough();

        service.pushToQueueOnConfirm(color);
        expect(appendSpy).toHaveBeenCalledTimes(1);
    });

    it('pushToQueueOnConfirm should not call dequeue when tenLastUsedColors does not contains the color grey and the queue of string have only 3 color initially', () => {
        let color = 'grey' as string;

        service.tenLastUsedColors.append('yellow');
        service.tenLastUsedColors.append('black');
        service.tenLastUsedColors.append('blue');

        let dequeueSpy = spyOn<any>(service.tenLastUsedColors, 'dequeue').and.callThrough();
        service.pushToQueueOnConfirm(color);
        expect(dequeueSpy).not.toHaveBeenCalled();
    });

    it('pushToQueueOnConfirm should call dequeue once when tenLastUsedColors does not contains the color purple and the queue lenght is equal than MAX_NUMBER_IN_LIST_OF_LAST_USED', () => {
        let color = 'purple' as string;

        service.tenLastUsedColors.append('yellow');
        service.tenLastUsedColors.append('black');
        service.tenLastUsedColors.append('blue');
        service.tenLastUsedColors.append('orange');
        service.tenLastUsedColors.append('pink');
        service.tenLastUsedColors.append('white');
        service.tenLastUsedColors.append('green');
        service.tenLastUsedColors.append('grey');
        service.tenLastUsedColors.append('gold');
        service.tenLastUsedColors.append('navy');

        let dequeueSpy = spyOn<any>(service.tenLastUsedColors, 'dequeue').and.callThrough();
        service.pushToQueueOnConfirm(color);
        expect(dequeueSpy).toHaveBeenCalledTimes(1);
    });

    it('pushToQueueOnConfirm should not call remove, append and dequeue when tenLastUsedColors have the color grey and the queue of string only have the color grey initially', () => {
        let color = 'grey' as string;

        service.tenLastUsedColors.append('grey');

        let removeSpy = spyOn<any>(service.tenLastUsedColors, 'remove').and.callThrough();
        let appendSpy = spyOn<any>(service.tenLastUsedColors, 'append').and.callThrough();
        let dequeueSpy = spyOn<any>(service.tenLastUsedColors, 'dequeue').and.callThrough();
        service.pushToQueueOnConfirm(color);
        expect(removeSpy).not.toHaveBeenCalled();
        expect(appendSpy).not.toHaveBeenCalled();
        expect(dequeueSpy).not.toHaveBeenCalled();
    });

    it('pushToQueueOnConfirm should not call remove, append and dequeue when tenLastUsedColors have the color grey and the queue of string only have the color grey initially', () => {
        let color = 'grey' as string;

        service.tenLastUsedColors.append('grey');
        service.tenLastUsedColors.append('white');

        let removeSpy = spyOn<any>(service.tenLastUsedColors, 'remove').and.callThrough();
        let appendSpy = spyOn<any>(service.tenLastUsedColors, 'append').and.callThrough();
        service.pushToQueueOnConfirm(color);
        expect(removeSpy).toHaveBeenCalledTimes(1);
        expect(appendSpy).toHaveBeenCalledTimes(1);
    });

    it('pushToQueueOnConfirm should call remove, append and dequeue once when tenLastUsedColors contains grey and the queue length is equal to MAX_NUMBER_IN_LIST_OF_LAST_USED', () => {
        let color = 'grey' as string;

        service.tenLastUsedColors.append('yellow');
        service.tenLastUsedColors.append('black');
        service.tenLastUsedColors.append('blue');
        service.tenLastUsedColors.append('orange');
        service.tenLastUsedColors.append('pink');
        service.tenLastUsedColors.append('white');
        service.tenLastUsedColors.append('green');
        service.tenLastUsedColors.append('grey');
        service.tenLastUsedColors.append('gold');
        service.tenLastUsedColors.append('navy');
        service.tenLastUsedColors.append('silver');

        let removeSpy = spyOn<any>(service.tenLastUsedColors, 'remove').and.callThrough();
        let appendSpy = spyOn<any>(service.tenLastUsedColors, 'append').and.callThrough();
        let dequeueSpy = spyOn<any>(service.tenLastUsedColors, 'dequeue').and.callThrough();

        service.pushToQueueOnConfirm(color);

        expect(removeSpy).toHaveBeenCalledTimes(1);
        expect(appendSpy).toHaveBeenCalledTimes(1);
        expect(dequeueSpy).toHaveBeenCalledTimes(1);
    });

    it('pushToQueueOnConfirm should call remove and append once when tenLastUsedColors contains grey and the queue length is lower to MAX_NUMBER_IN_LIST_OF_LAST_USED but greater than 1', () => {
        let color = 'grey' as string;

        service.tenLastUsedColors.append('yellow');
        service.tenLastUsedColors.append('black');
        service.tenLastUsedColors.append('blue');
        service.tenLastUsedColors.append('grey');

        let removeSpy = spyOn<any>(service.tenLastUsedColors, 'remove').and.callThrough();
        let appendSpy = spyOn<any>(service.tenLastUsedColors, 'append').and.callThrough();

        service.pushToQueueOnConfirm(color);

        expect(removeSpy).toHaveBeenCalledTimes(1);
        expect(appendSpy).toHaveBeenCalledTimes(1);
    });

    it('pushToQueueOnConfirm should not call dequeue when tenLastUsedColors contains grey and the queue length is lower to MAX_NUMBER_IN_LIST_OF_LAST_USED but greater than 1', () => {
        let color = 'grey' as string;

        service.tenLastUsedColors.append('yellow');
        service.tenLastUsedColors.append('black');
        service.tenLastUsedColors.append('blue');
        service.tenLastUsedColors.append('orange');
        service.tenLastUsedColors.append('pink');
        service.tenLastUsedColors.append('white');
        service.tenLastUsedColors.append('green');
        service.tenLastUsedColors.append('grey');
        service.tenLastUsedColors.append('gold');
        service.tenLastUsedColors.append('navy');

        let dequeueSpy = spyOn<any>(service.tenLastUsedColors, 'dequeue').and.callThrough();

        service.pushToQueueOnConfirm(color);

        expect(dequeueSpy).not.toHaveBeenCalled();
    });

    it('pushToQueueOnConfirm should not call dequeue but should call remove and append once when tenLastUsedColors contains grey and the queue length is equal to MAX_NUMBER_IN_LIST_OF_LAST_USED', () => {
        let color = 'grey' as string;

        service.tenLastUsedColors.append('yellow');
        service.tenLastUsedColors.append('black');
        service.tenLastUsedColors.append('blue');
        service.tenLastUsedColors.append('grey');

        let dequeueSpy = spyOn<any>(service.tenLastUsedColors, 'dequeue').and.callThrough();
        let removeSpy = spyOn<any>(service.tenLastUsedColors, 'remove').and.callThrough();
        let appendSpy = spyOn<any>(service.tenLastUsedColors, 'append').and.callThrough();

        service.pushToQueueOnConfirm(color);

        expect(removeSpy).toHaveBeenCalledTimes(1);
        expect(appendSpy).toHaveBeenCalledTimes(1);
        expect(dequeueSpy).not.toHaveBeenCalled();
    });
});
