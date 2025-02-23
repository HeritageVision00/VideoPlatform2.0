import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextivaComponent } from './nextiva.component';

describe('NextivaComponent', () => {
  let component: NextivaComponent;
  let fixture: ComponentFixture<NextivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextivaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
