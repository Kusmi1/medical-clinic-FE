import { Component, EventEmitter, Input, Output } from '@angular/core';

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

  @Output() clickAgainMakeAppointmentButton: EventEmitter<void> = new EventEmitter<void>();
  @Output() clickCancelButton: EventEmitter<void> = new EventEmitter<void>();

  againMakeAppointment(): void {
    this.clickAgainMakeAppointmentButton.emit();
  }

  cancelAppointment(): void {
    this.clickCancelButton.emit();
  }
}