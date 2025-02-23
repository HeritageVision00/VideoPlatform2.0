import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformtrackingComponent } from './uniformtracking.component';

describe('UniformtrackingComponent', () => {
  let component: UniformtrackingComponent;
  let fixture: ComponentFixture<UniformtrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UniformtrackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UniformtrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
