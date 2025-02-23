import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseDwellComponent } from './nurse-dwell.component';

describe('NurseDwellComponent', () => {
  let component: NurseDwellComponent;
  let fixture: ComponentFixture<NurseDwellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NurseDwellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseDwellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
