import { TestBed } from '@angular/core/testing';

import { SynoptiqueService } from './synoptique.service';

describe('SynoptiqueService', () => {
  let service: SynoptiqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SynoptiqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
