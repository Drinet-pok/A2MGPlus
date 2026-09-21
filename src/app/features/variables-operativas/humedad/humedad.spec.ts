import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Humedad } from './humedad';

describe('Humedad', () => {
  let component: Humedad;
  let fixture: ComponentFixture<Humedad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Humedad],
    }).compileComponents();

    fixture = TestBed.createComponent(Humedad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
