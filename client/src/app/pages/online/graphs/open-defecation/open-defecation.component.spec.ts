import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenDefecationComponent } from './open-defecation.component';

describe('OpenDefecationComponent', () => {
  let component: OpenDefecationComponent;
  let fixture: ComponentFixture<OpenDefecationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenDefecationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDefecationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
