import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesOperativas } from './variables-operativas';

describe('VariablesOperativas', () => {
  let component: VariablesOperativas;
  let fixture: ComponentFixture<VariablesOperativas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariablesOperativas],
    }).compileComponents();

    fixture = TestBed.createComponent(VariablesOperativas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
