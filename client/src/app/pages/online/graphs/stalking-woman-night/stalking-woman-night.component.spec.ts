import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StalkingWomanNightComponent } from './stalking-woman-night.component';

describe('StalkingWomanNightComponent', () => {
  let component: StalkingWomanNightComponent;
  let fixture: ComponentFixture<StalkingWomanNightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StalkingWomanNightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StalkingWomanNightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
