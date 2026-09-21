import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimaDepositacion } from './ultima-depositacion';

describe('UltimaDepositacion', () => {
  let component: UltimaDepositacion;
  let fixture: ComponentFixture<UltimaDepositacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UltimaDepositacion],
    }).compileComponents();

    fixture = TestBed.createComponent(UltimaDepositacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
