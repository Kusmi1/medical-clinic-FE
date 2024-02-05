import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-appointment-details-popup',
  templateUrl: './appointment-details-popup.component.html',
  styleUrls: ['./appointment-details-popup.component.scss'],
})
export class AppointmentDetailsPopupComponent {
  medicines: string;
  description: string;
  pin: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.medicines = data.medicines;
    this.description = data.description;
    this.pin = data.pin;
  }
}
