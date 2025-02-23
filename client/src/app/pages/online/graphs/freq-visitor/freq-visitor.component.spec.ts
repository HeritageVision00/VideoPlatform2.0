import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreqVisitorComponent } from './freq-visitor.component';

describe('FreqVisitorComponent', () => {
  let component: FreqVisitorComponent;
  let fixture: ComponentFixture<FreqVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreqVisitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreqVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
