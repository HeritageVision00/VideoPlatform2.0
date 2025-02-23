import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentssumComponent } from './accidentssum.component';

describe('AccidentssumComponent', () => {
  let component: AccidentssumComponent;
  let fixture: ComponentFixture<AccidentssumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccidentssumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentssumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
