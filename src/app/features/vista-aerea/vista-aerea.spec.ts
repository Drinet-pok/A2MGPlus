import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAerea } from './vista-aerea';

describe('VistaAerea', () => {
  let component: VistaAerea;
  let fixture: ComponentFixture<VistaAerea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaAerea],
    }).compileComponents();

    fixture = TestBed.createComponent(VistaAerea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
