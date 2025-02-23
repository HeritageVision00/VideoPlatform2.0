import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenSafetyComponent } from './women-safety.component';

describe('WomenSafetyComponent', () => {
  let component: WomenSafetyComponent;
  let fixture: ComponentFixture<WomenSafetyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WomenSafetyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WomenSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
