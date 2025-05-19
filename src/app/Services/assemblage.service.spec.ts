import { TestBed } from '@angular/core/testing';

import { AssemblageService } from './assemblage.service';

describe('AssemblageService', () => {
  let service: AssemblageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssemblageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
