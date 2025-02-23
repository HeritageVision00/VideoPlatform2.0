import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkersGroupComponent } from './drinkers-group.component';

describe('DrinkersGroupComponent', () => {
  let component: DrinkersGroupComponent;
  let fixture: ComponentFixture<DrinkersGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrinkersGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkersGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
