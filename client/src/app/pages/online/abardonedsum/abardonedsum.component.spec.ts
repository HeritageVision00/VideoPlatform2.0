import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbardonedsumComponent } from './abardonedsum.component';

describe('AbardonedsumComponent', () => {
  let component: AbardonedsumComponent;
  let fixture: ComponentFixture<AbardonedsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbardonedsumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbardonedsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
