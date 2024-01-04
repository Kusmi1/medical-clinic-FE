import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAppointmentComponent } from './add-new-appointment.component';

describe('BoardAdminComponent', () => {
  let component: AddNewAppointmentComponent;
  let fixture: ComponentFixture<AddNewAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewAppointmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
