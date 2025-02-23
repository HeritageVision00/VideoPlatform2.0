import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnprsumComponent } from './anprsum.component';

describe('AnprsumComponent', () => {
  let component: AnprsumComponent;
  let fixture: ComponentFixture<AnprsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnprsumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnprsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
