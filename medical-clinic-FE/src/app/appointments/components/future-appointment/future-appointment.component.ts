import { Component } from '@angular/core';
import { VisitModel } from '../../../models/visit.model';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';

@Component({
  selector: 'app-future-appointment',
  templateUrl: './future-appointment.component.html',
  styleUrls: ['./future-appointment.component.scss'],
})
export class FutureAppointmentComponent {
  futureVisits: VisitModel[] | undefined;
  constructor(private appointmentsService: AppointmentsService) {}

  ngOnInit(): void {
    this.loadFutureVisits();
  }

  loadFutureVisits(): void {
    this.appointmentsService.getFutureBookedVisits().subscribe(visits => {
      this.futureVisits = visits;
    });
  }
}
