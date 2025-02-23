import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponsumComponent } from './weaponsum.component';

describe('WeaponsumComponent', () => {
  let component: WeaponsumComponent;
  let fixture: ComponentFixture<WeaponsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WeaponsumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
