import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdgeCrossingComponent } from './edge-crossing.component';

describe('EdgeCrossingComponent', () => {
  let component: EdgeCrossingComponent;
  let fixture: ComponentFixture<EdgeCrossingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EdgeCrossingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EdgeCrossingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
