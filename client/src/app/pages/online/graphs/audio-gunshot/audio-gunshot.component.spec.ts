import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioGunshotComponent } from './audio-gunshot.component';

describe('AudioGunshotComponent', () => {
  let component: AudioGunshotComponent;
  let fixture: ComponentFixture<AudioGunshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioGunshotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioGunshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
