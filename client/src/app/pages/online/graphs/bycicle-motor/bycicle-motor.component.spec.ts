import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BycicleMotorComponent } from './bycicle-motor.component';

describe('BycicleMotorComponent', () => {
  let component: BycicleMotorComponent;
  let fixture: ComponentFixture<BycicleMotorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BycicleMotorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BycicleMotorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
