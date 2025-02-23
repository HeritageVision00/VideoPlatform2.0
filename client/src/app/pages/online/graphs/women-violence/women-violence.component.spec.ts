import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenViolenceComponent } from './women-violence.component';

describe('WomenViolenceComponent', () => {
  let component: WomenViolenceComponent;
  let fixture: ComponentFixture<WomenViolenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WomenViolenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WomenViolenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
