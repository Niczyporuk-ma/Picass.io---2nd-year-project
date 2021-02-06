import { TestBed } from '@angular/core/testing';

import { LineHelperService } from './line-helper.service';

describe('LineHelperService', () => {
    let service: LineHelperService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineHelperService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
