import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardNurseComponent } from './board-nurse.component';

describe('BoardAdminComponent', () => {
  let component: BoardNurseComponent;
  let fixture: ComponentFixture<BoardNurseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoardNurseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardNurseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
