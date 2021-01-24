import { TestBed } from '@angular/core/testing';

import { ToolselectorService } from './toolselector.service';

describe('ToolselectorService', () => {
  let service: ToolselectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolselectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
