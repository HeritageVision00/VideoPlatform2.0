import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpTrackComponent } from './jump-track.component';

describe('JumpTrackComponent', () => {
  let component: JumpTrackComponent;
  let fixture: ComponentFixture<JumpTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JumpTrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JumpTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
