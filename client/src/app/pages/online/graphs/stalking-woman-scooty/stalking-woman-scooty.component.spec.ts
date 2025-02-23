import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StalkingWomanScootyComponent } from './stalking-woman-scooty.component';

describe('StalkingWomanScootyComponent', () => {
  let component: StalkingWomanScootyComponent;
  let fixture: ComponentFixture<StalkingWomanScootyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StalkingWomanScootyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StalkingWomanScootyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
