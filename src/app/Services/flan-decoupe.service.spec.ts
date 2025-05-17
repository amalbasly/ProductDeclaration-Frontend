import { TestBed } from '@angular/core/testing';

import { FlanDecoupeService } from './flan-decoupe.service';

describe('FlanDecoupeService', () => {
  let service: FlanDecoupeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlanDecoupeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
