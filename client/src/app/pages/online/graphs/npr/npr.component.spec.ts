import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NprComponent } from './npr.component';

describe('NprComponent', () => {
  let component: NprComponent;
  let fixture: ComponentFixture<NprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NprComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
