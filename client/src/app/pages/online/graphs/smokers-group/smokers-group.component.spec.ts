import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmokersGroupComponent } from './smokers-group.component';

describe('SmokersGroupComponent', () => {
  let component: SmokersGroupComponent;
  let fixture: ComponentFixture<SmokersGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmokersGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmokersGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
