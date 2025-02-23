import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrequentVisitingComponent } from './frequent-visiting.component';

describe('FrequentVisitingComponent', () => {
  let component: FrequentVisitingComponent;
  let fixture: ComponentFixture<FrequentVisitingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrequentVisitingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrequentVisitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
