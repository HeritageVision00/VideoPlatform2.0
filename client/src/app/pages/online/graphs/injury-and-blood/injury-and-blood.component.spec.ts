import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuryAndBloodComponent } from './injury-and-blood.component';

describe('InjuryAndBloodComponent', () => {
  let component: InjuryAndBloodComponent;
  let fixture: ComponentFixture<InjuryAndBloodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuryAndBloodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuryAndBloodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
