import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWinComponent } from './delete-win.component';

describe('DeleteWinComponent', () => {
  let component: DeleteWinComponent;
  let fixture: ComponentFixture<DeleteWinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteWinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
