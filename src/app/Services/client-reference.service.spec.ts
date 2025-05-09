import { TestBed } from '@angular/core/testing';

import { ClientReferenceService } from './client-reference.service';

describe('ClientReferenceService', () => {
  let service: ClientReferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientReferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
