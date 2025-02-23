import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JaywalkingComponent } from './jaywalking.component';

describe('JaywalkingComponent', () => {
  let component: JaywalkingComponent;
  let fixture: ComponentFixture<JaywalkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JaywalkingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JaywalkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
