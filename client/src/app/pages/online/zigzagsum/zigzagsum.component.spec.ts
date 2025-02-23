import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZigzagsumComponent } from './zigzagsum.component';

describe('ZigzagsumComponent', () => {
  let component: ZigzagsumComponent;
  let fixture: ComponentFixture<ZigzagsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZigzagsumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZigzagsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
