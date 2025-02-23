import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverspeedsumComponent } from './overspeedsum.component';

describe('OverspeedsumComponent', () => {
  let component: OverspeedsumComponent;
  let fixture: ComponentFixture<OverspeedsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverspeedsumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverspeedsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
