import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinegraphsComponent } from './linegraphs.component';

describe('LinegraphsComponent', () => {
  let component: LinegraphsComponent;
  let fixture: ComponentFixture<LinegraphsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinegraphsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinegraphsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
