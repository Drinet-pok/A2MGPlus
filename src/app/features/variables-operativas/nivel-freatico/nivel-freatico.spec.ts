import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelFreatico } from './nivel-freatico';

describe('NivelFreatico', () => {
  let component: NivelFreatico;
  let fixture: ComponentFixture<NivelFreatico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NivelFreatico],
    }).compileComponents();

    fixture = TestBed.createComponent(NivelFreatico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
