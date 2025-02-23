import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StalkingWomanAreaComponent } from './stalking-woman-area.component';

describe('StalkingWomanAreaComponent', () => {
  let component: StalkingWomanAreaComponent;
  let fixture: ComponentFixture<StalkingWomanAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StalkingWomanAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StalkingWomanAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
