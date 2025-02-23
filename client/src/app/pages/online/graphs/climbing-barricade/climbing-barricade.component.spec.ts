import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimbingBarricadeComponent } from './climbing-barricade.component';

describe('ClimbingBarricadeComponent', () => {
  let component: ClimbingBarricadeComponent;
  let fixture: ComponentFixture<ClimbingBarricadeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClimbingBarricadeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClimbingBarricadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
