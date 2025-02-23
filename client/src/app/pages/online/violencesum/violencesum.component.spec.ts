import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolencesumComponent } from './violencesum.component';

describe('ViolencesumComponent', () => {
  let component: ViolencesumComponent;
  let fixture: ComponentFixture<ViolencesumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolencesumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolencesumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
