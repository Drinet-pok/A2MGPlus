import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CondicionMesas } from './condicion-mesas';

describe('CondicionMesas', () => {
  let component: CondicionMesas;
  let fixture: ComponentFixture<CondicionMesas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CondicionMesas],
    }).compileComponents();

    fixture = TestBed.createComponent(CondicionMesas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
