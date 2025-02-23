import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoorimgedashboardComponent } from './videoorimgedashboard.component';

describe('VideoorimgedashboardComponent', () => {
  let component: VideoorimgedashboardComponent;
  let fixture: ComponentFixture<VideoorimgedashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoorimgedashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoorimgedashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
