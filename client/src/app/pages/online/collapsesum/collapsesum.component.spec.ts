import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollapsesumComponent } from './collapsesum.component';

describe('CollapsesumComponent', () => {
  let component: CollapsesumComponent;
  let fixture: ComponentFixture<CollapsesumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollapsesumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsesumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
