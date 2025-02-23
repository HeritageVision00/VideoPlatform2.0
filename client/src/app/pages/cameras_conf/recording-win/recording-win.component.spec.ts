import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingWinComponent } from './recording-win.component';

describe('RecordingWinComponent', () => {
  let component: RecordingWinComponent;
  let fixture: ComponentFixture<RecordingWinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingWinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
