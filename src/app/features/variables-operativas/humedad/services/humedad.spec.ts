import { TestBed } from '@angular/core/testing';

import { HumedadService } from './humedad';

describe('Humedad', () => {
  let service: HumedadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HumedadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
