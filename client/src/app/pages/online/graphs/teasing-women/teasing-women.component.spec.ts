import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeasingWomenComponent } from './teasing-women.component';

describe('TeasingWomenComponent', () => {
  let component: TeasingWomenComponent;
  let fixture: ComponentFixture<TeasingWomenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeasingWomenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeasingWomenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
