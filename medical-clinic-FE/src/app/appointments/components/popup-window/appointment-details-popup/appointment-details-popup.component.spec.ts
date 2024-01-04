import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentDetailsPopupComponent } from './appointment-details-popup.component';

describe('AppointmentDetailsPopupComponent', () => {
  let component: AppointmentDetailsPopupComponent;
  let fixture: ComponentFixture<AppointmentDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentDetailsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
