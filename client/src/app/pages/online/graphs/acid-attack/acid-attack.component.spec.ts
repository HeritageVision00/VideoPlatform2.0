import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcidAttackComponent } from './acid-attack.component';

describe('AcidAttackComponent', () => {
  let component: AcidAttackComponent;
  let fixture: ComponentFixture<AcidAttackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcidAttackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcidAttackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
