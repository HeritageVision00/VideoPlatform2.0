import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnconsciousComponent } from './unconscious.component';

describe('UnconsciousComponent', () => {
  let component: UnconsciousComponent;
  let fixture: ComponentFixture<UnconsciousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnconsciousComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnconsciousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
