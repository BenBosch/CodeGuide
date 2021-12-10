import { TestBed } from '@angular/core/testing';

import { ActiveDirectoryUserInfoService } from './active-directory-user-info.service';

describe('ActiveDirectoryUserInfoService', () => {
  let service: ActiveDirectoryUserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveDirectoryUserInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
