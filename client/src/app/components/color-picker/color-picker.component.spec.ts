// inspired by : https://malcoded.com/posts/angular-color-picker/
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//import { ColorService } from '@app/services/tools/color.service';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    //let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        //colorService = TestBed.inject(ColorService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it(' selectPrimaryColor should set primary to true on left click', () => {
    //     const mouseEventLClick = {
    //         offsetX: 25,
    //         offsetY: 25,
    //         button: 0,
    //     } as MouseEvent;
    //     component.selectPrimaryColor(mouseEventLClick);
    //     expect(component.primary).toEqual(true);
    // });

    // it(' selectPrimaryColor should set color to the primary color of color service on left click', () => {
    //     const mouseEventLClick = {
    //         offsetX: 25,
    //         offsetY: 25,
    //         button: 0,
    //     } as MouseEvent;
    //     component.selectPrimaryColor(mouseEventLClick);
    //     expect(component.color).toEqual(colorService.primaryColor);
    // });

    // it(' selectSecondaryColor should set primary to false on left click', () => {
    //     const mouseEventLClick = {
    //         offsetX: 25,
    //         offsetY: 25,
    //         button: 0,
    //     } as MouseEvent;
    //     component.selectSecondaryColor(mouseEventLClick);
    //     expect(component.primary).toEqual(false);
    // });

    // it(' selectSecondaryColor should set color to the secondary color of color service on left click', () => {
    //     const mouseEventLClick = {
    //         offsetX: 25,
    //         offsetY: 25,
    //         button: 0,
    //     } as MouseEvent;
    //     component.selectSecondaryColor(mouseEventLClick);
    //     expect(component.color).toEqual(colorService.secondaryColor);
    // });

    // it(' changeOpacity should set colorService opacity with a given opacity and setPrimaryColorWithOpacity along with setSecondaryColorwithOpacity will both be called', () => {
    //     const setPrimaryColorWithOpacity = spyOn<any>(colorService, 'setPrimaryColorWithOpacity').and.stub();
    //     const setSecondarColorWithOpacity = spyOn<any>(colorService, 'setSecondaryColorWithOpacity').and.stub();
    //     const opacity: number = 1;
    //     component.changeOpacity(opacity);
    //     expect(colorService.opacity).toEqual(opacity);
    //     expect(setPrimaryColorWithOpacity).toHaveBeenCalledWith(opacity);
    //     expect(setSecondarColorWithOpacity).toHaveBeenCalledWith(opacity);
    // });

    // it(' splitColor should return replaced colorToSplit', () => {
    //     const colorToSplit: string = 'rgba(255,250,66,0)';
    //     const colorToSplitStringArray: string[] = component.splitColor(colorToSplit);
    //     expect(colorToSplitStringArray[0]).toEqual('255');
    //     expect(colorToSplitStringArray[1]).toEqual('250');
    //     expect(colorToSplitStringArray[2]).toEqual('66');
    //     expect(colorToSplitStringArray[3]).toEqual('0');
    // });

    // /*
    // it(' adjustRed should expect green and blue to be 0 by splitting the default color by index', () => {
    //     component.green = '0';
    //     component.blue = '0';
    //     expect(component.green).toEqual(component.splitColor(component.color)[component.greenIndex]);
    //     expect(component.green).toEqual(component.splitColor(component.color)[component.blueIndex]);
    // });
    // */

    // it(' adjustRed should expect green and blue to be 0 by splitting the default color by index', () => {
    //     component.primary = true;
    //     const event = new KeyboardEvent('keydown', { key: '255' });
    //     component.adjustRed(event);
    //     component.color = 'rgba(' + '255' + ',' + component.green + ',' + component.blue + ',' + component.opacity;
    //     expect(colorService.primaryColor).toEqual(component.color);
    //     //expect(component.green).toEqual(component.splitColor(component.color)[component.blueIndex]);
    // });

    // fit(' adjustRed should expect green and blue to be 0 by splitting the default color by index', () => {
    //     component.primary = false;
    //     const event = new KeyboardEvent('keydown', { key: '255' });
    //     Object.defineProperty(event, 'target', { value: { value: '255' } }); // tiré de https://stackoverflow.com/questions/27108094/how-to-set-target-property-when-simulating-mouseclick-in-javascript
    //     component.adjustRed(event);
    //     // component.color = 'rgba(' + '255' + ',' + component.green + ',' + component.blue + ',' + component.opacity;
    //     expect(colorService.secondaryColor).toEqual(component.color);
    //     //expect(component.green).toEqual(component.splitColor(component.color)[component.blueIndex]);
    // });

    // it(' adjustGreen should expect green and blue to be 0 by splitting the default color by index', () => {
    //     component.primary = true;
    //     const event = new KeyboardEvent('keydown', { key: '255' });
    //     component.adjustGreen(event);
    //     component.color = 'rgba(' + '255' + ',' + component.green + ',' + component.blue + ',' + component.opacity;
    //     expect(colorService.primaryColor).toEqual(component.color);
    //     //expect(component.green).toEqual(component.splitColor(component.color)[component.blueIndex]);
    // });

    // it(' adjustBlue should expect green and blue to be 0 by splitting the default color by index', () => {
    //     component.primary = true;
    //     const event = new KeyboardEvent('keydown', { key: '255' });
    //     component.adjustBlue(event);
    //     component.color = 'rgba(' + '255' + ',' + component.green + ',' + component.blue + ',' + component.opacity;
    //     expect(colorService.primaryColor).toEqual(component.color);
    //     //expect(component.green).toEqual(component.splitColor(component.color)[component.blueIndex]);
    // });
    // /*
    // adjustRed(redIntensity: KeyboardEvent): void {
    //     let value = '';
    //     value += (redIntensity.target as HTMLInputElement).value;
    //     this.green = this.splitColor(this.color)[this.greenIndex];
    //     this.blue = this.splitColor(this.color)[this.blueIndex];
    //     const opacity = this.splitColor(this.color)[this.opacityIndex];
    //     this.color = 'rgba(' + value + ',' + this.green + ',' + this.blue + ',' + opacity;
    //     if (this.primary) {
    //         this.colorService.primaryColor = this.color;
    //         this.colorService.setPrimaryColorWithOpacity(this.colorService.opacity);
    //     } else {
    //         this.colorService.secondaryColor = this.color;
    //         this.colorService.setSecondaryColorWithOpacity(this.colorService.opacity);
    //     }
    // }*/
});
