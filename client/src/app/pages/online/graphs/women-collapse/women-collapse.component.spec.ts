import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenCollapseComponent } from './women-collapse.component';

describe('WomenCollapseComponent', () => {
  let component: WomenCollapseComponent;
  let fixture: ComponentFixture<WomenCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WomenCollapseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WomenCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
