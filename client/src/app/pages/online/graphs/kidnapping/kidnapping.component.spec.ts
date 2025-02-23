import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KidnappingComponent } from './kidnapping.component';

describe('KidnappingComponent', () => {
  let component: KidnappingComponent;
  let fixture: ComponentFixture<KidnappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KidnappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KidnappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
