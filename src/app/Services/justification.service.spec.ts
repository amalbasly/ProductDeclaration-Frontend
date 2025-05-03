import { TestBed } from '@angular/core/testing';

import { JustificationService } from './justification.service';

describe('JustificationService', () => {
  let service: JustificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
