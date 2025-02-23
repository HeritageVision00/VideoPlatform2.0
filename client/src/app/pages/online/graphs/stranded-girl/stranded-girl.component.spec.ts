import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrandedGirlComponent } from './stranded-girl.component';

describe('StrandedGirlComponent', () => {
  let component: StrandedGirlComponent;
  let fixture: ComponentFixture<StrandedGirlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrandedGirlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrandedGirlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
