import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugsdistributionComponent } from './drugsdistribution.component';

describe('DrugsdistributionComponent', () => {
  let component: DrugsdistributionComponent;
  let fixture: ComponentFixture<DrugsdistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrugsdistributionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugsdistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
