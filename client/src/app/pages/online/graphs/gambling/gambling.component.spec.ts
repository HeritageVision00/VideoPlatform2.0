import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamblingComponent } from './gambling.component';

describe('GamblingComponent', () => {
  let component: GamblingComponent;
  let fixture: ComponentFixture<GamblingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamblingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamblingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
