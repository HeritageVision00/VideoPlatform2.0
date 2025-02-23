import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalemovementComponent } from './malemovement.component';

describe('MalemovementComponent', () => {
  let component: MalemovementComponent;
  let fixture: ComponentFixture<MalemovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MalemovementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MalemovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
