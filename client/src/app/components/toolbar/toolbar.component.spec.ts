import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutEventOutput, ShortcutInput } from 'ng-keyboard-shortcuts';
import { ToolbarComponent } from './toolbar.component';

class MatDialogMock {
    // tslint:disable-next-line:no-any
    openDialogs: MatDialogRef<any>[] = [];
    open(): {} {
        return {};
    }
}

describe('ToolbarComponent', () => {
    // tslint:disable:no-magic-numbers
    // tslint:disable:max-file-line-count
    let component: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let ctxSpyObject: jasmine.SpyObj<CanvasRenderingContext2D>;

    beforeEach(async(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        drawingServiceSpy.canvas = document.createElement('canvas');
        ctxSpyObject = jasmine.createSpyObj<CanvasRenderingContext2D>('CanvasRenderingContext2D', [
            'strokeStyle',
            'beginPath',
            'moveTo',
            'lineTo',
            'stroke',
        ]);
        drawingServiceSpy.gridCtx = ctxSpyObject;
        TestBed.configureTestingModule({
            declarations: [ToolbarComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: DrawingService, useValue: drawingServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        // modal = TestBed.inject(MatDialog);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' the shortcut g should call showGrid but should not open the carrousel', () => {
        const g = component.shortcuts.find((x) => x.key === 'g');
        const gSpy = spyOn(g as ShortcutInput, 'command').and.callThrough();
        const showGridSpy = spyOn(component.gridService, 'showGrid').and.callThrough();
        const keyboardEvent = new KeyboardEvent('keydown', { ctrlKey: true, key: 'g' });
        g?.command({ event: keyboardEvent, key: 'g' } as ShortcutEventOutput);
        expect(gSpy).toHaveBeenCalled();
        expect(showGridSpy).toHaveBeenCalled();
    });
});
