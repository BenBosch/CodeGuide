import { TestBed } from '@angular/core/testing';

import { ActiveDirectoryValidationService } from './active-directory-validation.service';

describe('ActiveDirectoryValidationService', () => {
  let service: ActiveDirectoryValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveDirectoryValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
