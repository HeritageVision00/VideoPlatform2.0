import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagebigComponent } from './imagebig.component';

describe('ImagebigComponent', () => {
  let component: ImagebigComponent;
  let fixture: ComponentFixture<ImagebigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImagebigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagebigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
