import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideospeedComponent } from './videospeed.component';

describe('VideospeedComponent', () => {
  let component: VideospeedComponent;
  let fixture: ComponentFixture<VideospeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideospeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideospeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
