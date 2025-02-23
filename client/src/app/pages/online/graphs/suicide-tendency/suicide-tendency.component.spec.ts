import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuicideTendencyComponent } from './suicide-tendency.component';

describe('SuicideTendencyComponent', () => {
  let component: SuicideTendencyComponent;
  let fixture: ComponentFixture<SuicideTendencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuicideTendencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuicideTendencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
