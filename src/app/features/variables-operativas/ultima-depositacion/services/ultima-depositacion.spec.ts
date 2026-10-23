import { TestBed } from '@angular/core/testing';

import { UltimaDepositacionService } from './ultima-depositacion';

describe('UltimaDepositacionService', () => {
  let service: UltimaDepositacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UltimaDepositacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
