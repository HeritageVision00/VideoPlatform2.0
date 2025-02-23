import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WrongTurnComponent } from './wrong-turn.component';

describe('WrongTurnComponent', () => {
  let component: WrongTurnComponent;
  let fixture: ComponentFixture<WrongTurnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WrongTurnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongTurnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
