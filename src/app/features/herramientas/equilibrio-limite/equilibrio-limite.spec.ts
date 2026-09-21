import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquilibrioLimite } from './equilibrio-limite';

describe('EquilibrioLimite', () => {
  let component: EquilibrioLimite;
  let fixture: ComponentFixture<EquilibrioLimite>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquilibrioLimite],
    }).compileComponents();

    fixture = TestBed.createComponent(EquilibrioLimite);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
