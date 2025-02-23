import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StuntBikersComponent } from './stunt-bikers.component';

describe('StuntBikersComponent', () => {
  let component: StuntBikersComponent;
  let fixture: ComponentFixture<StuntBikersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StuntBikersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StuntBikersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
