import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistedpersonsumComponent } from './blacklistedpersonsum.component';

describe('BlacklistedpersonsumComponent', () => {
  let component: BlacklistedpersonsumComponent;
  let fixture: ComponentFixture<BlacklistedpersonsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlacklistedpersonsumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistedpersonsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
