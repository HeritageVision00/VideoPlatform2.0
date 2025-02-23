import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrnmaterialComponent } from './prnmaterial.component';

describe('PrnmaterialComponent', () => {
  let component: PrnmaterialComponent;
  let fixture: ComponentFixture<PrnmaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrnmaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrnmaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
