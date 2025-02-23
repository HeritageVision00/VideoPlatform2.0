import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashingComponent } from './flashing.component';

describe('FlashingComponent', () => {
  let component: FlashingComponent;
  let fixture: ComponentFixture<FlashingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlashingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
