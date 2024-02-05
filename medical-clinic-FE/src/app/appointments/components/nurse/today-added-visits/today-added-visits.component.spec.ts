import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayAddedVisitsComponent } from './today-added-visits.component';

describe('TodayAddedVisitsComponent', () => {
  let component: TodayAddedVisitsComponent;
  let fixture: ComponentFixture<TodayAddedVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodayAddedVisitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayAddedVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
