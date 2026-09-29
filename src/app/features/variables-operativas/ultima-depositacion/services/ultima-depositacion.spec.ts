import { TestBed } from '@angular/core/testing';

import { UltimaDepositacion } from './ultima-depositacion';

describe('UltimaDepositacion', () => {
  let service: UltimaDepositacion;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UltimaDepositacion);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
