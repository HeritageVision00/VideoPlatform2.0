import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraffitiComponent } from './graffiti.component';

describe('GraffitiComponent', () => {
  let component: GraffitiComponent;
  let fixture: ComponentFixture<GraffitiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraffitiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraffitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
