import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetVendorComponent } from './street-vendor.component';

describe('StreetVendorComponent', () => {
  let component: StreetVendorComponent;
  let fixture: ComponentFixture<StreetVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreetVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreetVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
