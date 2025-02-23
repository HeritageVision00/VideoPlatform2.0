import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimerangeComponent } from './timerange.component';

describe('TimerangeComponent', () => {
  let component: TimerangeComponent;
  let fixture: ComponentFixture<TimerangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
