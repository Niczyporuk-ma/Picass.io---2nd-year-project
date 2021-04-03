import { TestBed } from '@angular/core/testing';

import { TextCommandService } from './text-command.service';

describe('TextCommandService', () => {
  let service: TextCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
