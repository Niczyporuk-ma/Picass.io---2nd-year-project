// inspired by : https://malcoded.com/posts/angular-color-picker/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ColorService } from '@app/services/tools/color.service';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    // let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // colorService = TestBed.inject(ColorService);
        // Configuration du spy du service
        // tslint:disable:no-string-literal
        // tslint:disable:no-magic-numbers
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' selectPrimaryColor should set primary to true on left click', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component.selectPrimaryColor(mouseEventLClick);
        expect(component.primary).toEqual(true);
    });

    it(' selectPrimaryColor should set color to the primary color of color service on left click', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component.selectPrimaryColor(mouseEventLClick);
        expect(component.color).toEqual(component.colorService.primaryColor);
    });

    it(' selectPrimaryColor should call splitColor on left click', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        const splitColorSpy = spyOn(component, 'splitColor').and.callThrough();
        component.selectPrimaryColor(mouseEventLClick);
        expect(splitColorSpy).toHaveBeenCalledWith(component.color);
    });

    it(' selectSecondaryColor should set primary to false on left click', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component.selectSecondaryColor(mouseEventLClick);
        expect(component.primary).toEqual(false);
    });

    it(' selectSecondaryColor should set color to the secondary color of color service on left click', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component.selectSecondaryColor(mouseEventLClick);
        expect(component.color).toEqual(component.colorService.secondaryColor);
    });

    it(' selectSecondaryColor should call splitColor on left click', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        const splitColorSpy = spyOn(component, 'splitColor').and.callThrough();
        component.selectSecondaryColor(mouseEventLClick);
        expect(splitColorSpy).toHaveBeenCalledWith(component.color);
    });

    it(' splitColor should return replaced colorToSplit', () => {
        const colorToSplit = 'rgba(255,250,66,0)';
        const colorToSplitStringArray: string[] = component.splitColor(colorToSplit);
        expect(colorToSplitStringArray[0]).toEqual('255');
        expect(colorToSplitStringArray[1]).toEqual('250');
        expect(colorToSplitStringArray[2]).toEqual('66');
        expect(colorToSplitStringArray[3]).toEqual('0');
    });

    it(' changePrimaryOpacity should affect primaryOpacityPreview with opacity', () => {
        const opacity = 50;
        component.changePrimaryOpacity(opacity);
        expect(component.colorService.primaryOpacityPreview).toEqual(50);
    });

    it(' changePrimaryOpacity should call changePrimaryOpacity with opacity', () => {
        const opacity = 50;
        const setPrimaryColorWithOpacitySpy = spyOn(component.colorService, 'setPrimaryColorWithOpacity').and.callThrough();
        component.changePrimaryOpacity(opacity);
        expect(setPrimaryColorWithOpacitySpy).toHaveBeenCalledWith(opacity);
    });

    it(' changeSecondaryOpacity should affect secondaryOpacityPreview with opacity', () => {
        const opacity = 75;
        component.changeSecondaryOpacity(opacity);
        expect(component.colorService.secondaryOpacityPreview).toEqual(75);
    });

    it(' changeSecondaryOpacity should call setSecondaryColorWithOpacity with opacity', () => {
        const opacity = 50;
        const setSecondaryColorWithOpacitySpy = spyOn(component.colorService, 'setSecondaryColorWithOpacity').and.callThrough();
        component.changeSecondaryOpacity(opacity);
        expect(setSecondaryColorWithOpacitySpy).toHaveBeenCalledWith(opacity);
    });

    it(' adjustColor should affect color if ctrlKey is false and isRed is true', () => {
        const keyboardEvent: KeyboardEvent = { ctrlKey: false } as KeyboardEvent;
        // Solution ci-dessous tirée de https://stackoverflow.com/questions/27108094/how-to-set-target-property-when-simulating-mouseclick-in-javascript
        Object.defineProperty(keyboardEvent, 'target', { value: { value: '255' } });
        const isNumberSpy = spyOn(component, 'isNumber').and.callThrough();
        component.isRed = true;
        component.adjustColor(keyboardEvent);
        expect(isNumberSpy).toHaveBeenCalledWith(597);
        expect(component.color).toEqual('rgba(597,0,0,1)');
    });

    it(' adjustColor should affect color if ctrlKey is false and isGreen is true', () => {
        const keyboardEvent: KeyboardEvent = { ctrlKey: false } as KeyboardEvent;
        // Solution ci-dessous tirée de https://stackoverflow.com/questions/27108094/how-to-set-target-property-when-simulating-mouseclick-in-javascript
        Object.defineProperty(keyboardEvent, 'target', { value: { value: '255' } });
        const isNumberSpy = spyOn(component, 'isNumber').and.callThrough();
        component.isGreen = true;
        component.adjustColor(keyboardEvent);
        expect(isNumberSpy).toHaveBeenCalledWith(597);
        expect(component.color).toEqual('rgba(0,597,0,1)');
    });

    it(' adjustColor should affect color if ctrlKey is false and isBlue is true', () => {
        const keyboardEvent: KeyboardEvent = { ctrlKey: false } as KeyboardEvent;
        // Solution ci-dessous tirée de https://stackoverflow.com/questions/27108094/how-to-set-target-property-when-simulating-mouseclick-in-javascript
        Object.defineProperty(keyboardEvent, 'target', { value: { value: '255' } });
        const isNumberSpy = spyOn(component, 'isNumber').and.callThrough();
        component.isBlue = true;
        component.adjustColor(keyboardEvent);
        expect(isNumberSpy).toHaveBeenCalledWith(597);
        expect(component.color).toEqual('rgba(0,0,597,1)');
    });

    it(' adjustColor should call setColorPreview and resetSelectedColors', () => {
        const setColorPreviewSpy = spyOn(component, 'setColorPreview').and.callThrough();
        const resetSelectedColorsSpy = spyOn(component, 'resetSelectedColors').and.callThrough();
        const keyboardEvent: KeyboardEvent = { ctrlKey: false } as KeyboardEvent;
        // Solution ci-dessous tirée de https://stackoverflow.com/questions/27108094/how-to-set-target-property-when-simulating-mouseclick-in-javascript
        Object.defineProperty(keyboardEvent, 'target', { value: { value: '255' } });
        component.adjustColor(keyboardEvent);
        expect(setColorPreviewSpy).toHaveBeenCalledWith(component.primary);
        expect(resetSelectedColorsSpy).toHaveBeenCalledWith();
    });

    it(' setColor should affect primaryColor with color and call setPrimaryColorWithOpacity if primary is true', () => {
        const primary = true;
        component.color = 'rgba(0,0,0,1)';
        const setPrimaryColorWithOpacitySpy = spyOn(component.colorService, 'setPrimaryColorWithOpacity').and.callThrough();
        component.setColor(primary);
        expect(component.colorService.primaryColor).toEqual(component.color);
        expect(setPrimaryColorWithOpacitySpy).toHaveBeenCalledWith(component.colorService.primaryOpacityPreview);
    });

    it(' setColor should affect secondaryColor with color and call setSecondaryColorWithOpacity if primary is false', () => {
        const primary = false;
        component.color = 'rgba(0,0,0,1)';
        const setSecondaryColorWithOpacitySpy = spyOn(component.colorService, 'setSecondaryColorWithOpacity').and.callThrough();
        component.setColor(primary);
        expect(component.colorService.secondaryColor).toEqual(component.color);
        expect(setSecondaryColorWithOpacitySpy).toHaveBeenCalledWith(component.colorService.secondaryOpacityPreview);
    });

    it(' setColorPreview should affect primaryColorPreview with color and call setPrimaryColorWithOpacity if primary is true', () => {
        const primary = true;
        component.color = 'rgba(0,0,0,1)';
        component.setColorPreview(primary);
        expect(component.colorService.primaryColorPreview).toEqual(component.color);
    });

    it(' setColorPreview should affect secondaryColorPreview with color and call setSecondaryColorWithOpacity if primary is false', () => {
        const primary = false;
        component.color = 'rgba(0,0,0,1)';
        component.setColorPreview(primary);
        expect(component.colorService.secondaryColorPreview).toEqual(component.color);
    });

    it(' rgbaToHex should expect #ff7b5764 if given rgba(255,123,87,1) while primary is true', () => {
        component.primary = true;
        const colorInRgba = 'rgba(255,123,87,1)';
        expect(component.rgbaToHex(colorInRgba)).toEqual('#ff7b5764');
    });

    it(' rgbaToHex should expect #ff7b5764 if given rgba(255,123,87,1) while primary is false', () => {
        component.primary = false;
        const colorInRgba = 'rgba(0,0,0,1)';
        expect(component.rgbaToHex(colorInRgba)).toEqual('#00000064');
    });

    it(' resetSelectedColors should make isRed, isGreen and isBlue false', () => {
        expect(component.isRed).toEqual(false);
        expect(component.isGreen).toEqual(false);
        expect(component.isBlue).toEqual(false);
    });

    it(' isNumber should return true if given a number', () => {
        const num = 10;
        expect(component.isNumber(num)).toEqual(true); // isNumber always takes number therefore shall always be true
    });

    it(' disableShortcut should make allowKeyPressEvents false ', () => {
        component.disableShortcut();
        expect(component.toolManager.allowKeyPressEvents).toEqual(false);
    });

    it(' enableShortcut should make allowKeyPressEvents true ', () => {
        component.enableShortcut();
        expect(component.toolManager.allowKeyPressEvents).toEqual(true);
    });

    it(' onMouseUp should make mouseDown false ', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component.onMouseUp(mouseEventLClick);
        expect(component['mouseDown']).toEqual(false);
    });

    it(' emitColor should call emit ', () => {
        const emitSpy = spyOn(component.colorEmitted, 'emit').and.callThrough();
        component.emitColor('rgba(0,0,0,1)');
        expect(emitSpy).toHaveBeenCalledWith('rgba(0,0,0,1)');
    });

    it(' onLeftClickPreviousColor should affect primaryColorPreview with color and call both setPrimaryColorWithOpacity and adjustQueueWhenSelectingPrevious if contextmenu is false and mouseDown is true', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component['contextmenu'] = false;
        component['mouseDown'] = true;
        const setPrimaryColorWithOpacitySpy = spyOn(component.colorService, 'setPrimaryColorWithOpacity').and.callThrough();
        const adjustQueueWhenSelectingPreviousSpy = spyOn(component, 'adjustQueueWhenSelectingPrevious').and.callThrough();
        component.onLeftClickPreviousColor(mouseEventLClick, 'rgba(0,0,42,1)');
        expect(component.colorService.primaryColorPreview).toEqual('rgba(0,0,42,1)');
        expect(setPrimaryColorWithOpacitySpy).toHaveBeenCalledWith(component.colorService.primaryOpacityPreview);
        expect(adjustQueueWhenSelectingPreviousSpy).toHaveBeenCalledWith('rgba(0,0,42,1)');
    });

    it(' onLeftClickPreviousColor should affect isConfirmed with false if contextmenu is false, mouseDown is true and isConfirmed is false', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component['contextmenu'] = false;
        component['mouseDown'] = true;
        component.colorService.isConfirmed = true;
        component.onLeftClickPreviousColor(mouseEventLClick, 'rgba(0,0,42,1)');
        expect(component.colorService.isConfirmed).toEqual(false);
    });

    it(' onRightClickPreviousColor should affect secondaryColorPreview with color and call both setSecondaryColorWithOpacity and adjustQueueWhenSelectingPrevious', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        const setSecondaryColorWithOpacitySpy = spyOn(component.colorService, 'setSecondaryColorWithOpacity').and.callThrough();
        const adjustQueueWhenSelectingPreviousSpy = spyOn(component, 'adjustQueueWhenSelectingPrevious').and.callThrough();
        component.onRightClickPreviousColor(mouseEventLClick, 'rgba(200,72,42,1)');
        expect(component.colorService.secondaryColorPreview).toEqual('rgba(200,72,42,1)');
        expect(setSecondaryColorWithOpacitySpy).toHaveBeenCalledWith(component.colorService.secondaryOpacityPreview);
        expect(adjustQueueWhenSelectingPreviousSpy).toHaveBeenCalledWith('rgba(200,72,42,1)');
    });

    it(' onRightClickPreviousColor should affect isConfirmed with false if isConfirmed is true and always return false', () => {
        const mouseEventLClick = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component.colorService.isConfirmed = true;
        component.onRightClickPreviousColor(mouseEventLClick, 'rgba(0,0,42,1)');
        expect(component.colorService.isConfirmed).toEqual(false);
        expect(component.onRightClickPreviousColor(mouseEventLClick, 'rgba(0,0,42,1)')).toEqual(false);
    });

    it(' adjustQueueWhenSelectingPrevious should call emit, remove and append with color if the length of tenLastUsedColors is strictly larger than 1', () => {
        const emitSpy = spyOn(component.colorEmitted, 'emit').and.callThrough();
        const removeSpy = spyOn(component.colorService.tenLastUsedColors, 'remove').and.callThrough();
        const appendSpy = spyOn(component.colorService.tenLastUsedColors, 'append').and.callThrough();
        // component.colorService.tenLastUsedColors['length'] = 3;
        Object.defineProperty(component.colorService.tenLastUsedColors, 'length', { value: 3 });
        component.adjustQueueWhenSelectingPrevious('rgba(100,0,42,1)');
        expect(emitSpy).toHaveBeenCalledWith('rgba(100,0,42,1)');
        expect(removeSpy).toHaveBeenCalledWith('rgba(100,0,42,1)');
        expect(appendSpy).toHaveBeenCalledWith('rgba(100,0,42,1)');
    });

    it(' adjustQueueWhenSelectingPrevious should call dequeue if the length of tenLastUsedColors is strictly larger than 10', () => {
        const dequeueSpy = spyOn(component.colorService.tenLastUsedColors, 'dequeue').and.callThrough();
        // component.colorService.tenLastUsedColors['length'] = 25;
        Object.defineProperty(component.colorService.tenLastUsedColors, 'length', { value: 25 });
        component.adjustQueueWhenSelectingPrevious('rgba(100,0,42,1)');
        expect(dequeueSpy).toHaveBeenCalled();
    });
});
