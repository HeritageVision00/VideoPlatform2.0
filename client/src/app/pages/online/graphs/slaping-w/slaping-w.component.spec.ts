import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlapingWComponent } from './slaping-w.component';

describe('SlapingWComponent', () => {
  let component: SlapingWComponent;
  let fixture: ComponentFixture<SlapingWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlapingWComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlapingWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
