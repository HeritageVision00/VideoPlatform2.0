import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SumsideComponent } from './sumside.component';

describe('SumsideComponent', () => {
  let component: SumsideComponent;
  let fixture: ComponentFixture<SumsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SumsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SumsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
