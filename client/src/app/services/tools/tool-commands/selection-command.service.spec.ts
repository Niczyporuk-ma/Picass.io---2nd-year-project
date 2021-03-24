import { TestBed } from '@angular/core/testing';
import { SelectionCommandService } from './selection-command.service';

describe('RectangleSelectionCommandService', () => {
    let service: SelectionCommandService;

    beforeEach(() => {
        // Configuration du spy
        // tslint:disable:no-string-literal
        // tslint:disable:no-magic-numbers
        // tslint:disable:max-file-line-count
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionCommandService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
