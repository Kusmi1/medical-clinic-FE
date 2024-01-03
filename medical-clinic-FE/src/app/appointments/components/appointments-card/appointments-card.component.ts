import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointments-card',
  templateUrl: './appointments-card.component.html',
  styleUrls: ['./appointments-card.component.scss'],
})
export class AppointmentsCardComponent {
  @Input() specialization = '';
  @Input() doctorName = '';
  @Input() doctorSurname = '';
  @Input() date = '';
  @Input() hour = '';
  @Input() address = '';
  @Input() isFutureDate = false;
  @Input() user = '';

  @Output() clickAgainMakeAppointmentButton: EventEmitter<void> = new EventEmitter<void>();
  @Output() clickCancelButton: EventEmitter<void> = new EventEmitter<void>();

  constructor(private snackBar: MatSnackBar) {}
  againMakeAppointment(): void {
    this.clickAgainMakeAppointmentButton.emit();
  }

  cancelAppointment(): void {
    this.clickCancelButton.emit();
  }
}
