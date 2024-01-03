import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsCardComponent } from './appointments-card.component';

describe('AppointmentsCardComponent', () => {
  let component: AppointmentsCardComponent;
  let fixture: ComponentFixture<AppointmentsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
