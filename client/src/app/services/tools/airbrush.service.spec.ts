import { TestBed } from '@angular/core/testing';

import { AirbrushService } from './airbrush.service';

describe('AirbrushService', () => {
  let service: AirbrushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirbrushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
