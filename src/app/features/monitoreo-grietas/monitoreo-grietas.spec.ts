import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoGrietas } from './monitoreo-grietas';

describe('MonitoreoGrietas', () => {
  let component: MonitoreoGrietas;
  let fixture: ComponentFixture<MonitoreoGrietas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoreoGrietas],
    }).compileComponents();

    fixture = TestBed.createComponent(MonitoreoGrietas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
