import { TestBed } from '@angular/core/testing';

import { GalliaService } from './gallia.service';

describe('GalliaService', () => {
  let service: GalliaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GalliaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
