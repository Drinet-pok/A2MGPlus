import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoDiaria } from './info-diaria';

describe('InfoDiaria', () => {
  let component: InfoDiaria;
  let fixture: ComponentFixture<InfoDiaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoDiaria],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoDiaria);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
