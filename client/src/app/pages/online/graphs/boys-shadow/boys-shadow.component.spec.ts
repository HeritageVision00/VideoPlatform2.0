import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoysShadowComponent } from './boys-shadow.component';

describe('BoysShadowComponent', () => {
  let component: BoysShadowComponent;
  let fixture: ComponentFixture<BoysShadowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoysShadowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoysShadowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
