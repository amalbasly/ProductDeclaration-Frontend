import { TestBed } from '@angular/core/testing';

import { ValidateEmployeeService } from './validate-employee.service';

describe('ValidateEmployeeService', () => {
  let service: ValidateEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
