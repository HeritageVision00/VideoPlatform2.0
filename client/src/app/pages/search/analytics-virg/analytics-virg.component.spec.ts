import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsVirgComponent } from './analytics-virg.component';

describe('AnalyticsVirgComponent', () => {
  let component: AnalyticsVirgComponent;
  let fixture: ComponentFixture<AnalyticsVirgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsVirgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsVirgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
