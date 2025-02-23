import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongwaysumComponent } from './wrongwaysum.component';

describe('WrongwaysumComponent', () => {
  let component: WrongwaysumComponent;
  let fixture: ComponentFixture<WrongwaysumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrongwaysumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongwaysumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
