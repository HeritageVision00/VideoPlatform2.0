import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InkthrowingComponent } from './inkthrowing.component';

describe('InkthrowingComponent', () => {
  let component: InkthrowingComponent;
  let fixture: ComponentFixture<InkthrowingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InkthrowingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InkthrowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
