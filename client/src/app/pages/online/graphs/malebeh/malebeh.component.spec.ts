import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MalebehComponent } from './malebeh.component';

describe('MalebehComponent', () => {
  let component: MalebehComponent;
  let fixture: ComponentFixture<MalebehComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MalebehComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MalebehComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
