import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorpalleteComponent } from './colorpallete.component';

describe('ColorpalleteComponent', () => {
  let component: ColorpalleteComponent;
  let fixture: ComponentFixture<ColorpalleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorpalleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorpalleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
