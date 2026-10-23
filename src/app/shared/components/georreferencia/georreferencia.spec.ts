import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Georreferencia } from './georreferencia';

describe('Georreferencia', () => {
  let component: Georreferencia;
  let fixture: ComponentFixture<Georreferencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Georreferencia],
    }).compileComponents();

    fixture = TestBed.createComponent(Georreferencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
