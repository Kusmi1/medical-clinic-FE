import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MedicalClinic, VisitModel } from '../../../models/visit.model';

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
  @Input() clinic: MedicalClinic | undefined;
  @Input() isFutureDate = false;
  @Input() showDetailsButton = false;
  @Input() user = '';

  @Output() clickAgainMakeAppointmentButton: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() clickCancelButton: EventEmitter<Event> = new EventEmitter<Event>();
  @Output() clickDetailsButton: EventEmitter<Event> = new EventEmitter<Event>();
}
