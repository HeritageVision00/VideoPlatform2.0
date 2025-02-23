import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbnormalRunningComponent } from './abnormal-running.component';

describe('AbnormalRunningComponent', () => {
  let component: AbnormalRunningComponent;
  let fixture: ComponentFixture<AbnormalRunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbnormalRunningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbnormalRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
