import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsencesnopersonComponent } from './absencesnoperson.component';

describe('AbsencesnopersonComponent', () => {
  let component: AbsencesnopersonComponent;
  let fixture: ComponentFixture<AbsencesnopersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbsencesnopersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbsencesnopersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
