import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';
import { VisitModel } from '../../../models/visit.model';

@Component({
  selector: 'app-recent-appointments',
  templateUrl: './recent-appointments.component.html',
  styleUrls: ['./recent-appointments.component.scss'],
})
export class RecentAppointmentsComponent implements OnInit {
  pastVisits: VisitModel[] | undefined;
  constructor(private appointmentsService: AppointmentsService) {}

  ngOnInit(): void {
    this.loadPastVisits();
  }

  loadPastVisits(): void {
    this.appointmentsService.getPastBookedVisits().subscribe(visits => {
      this.pastVisits = visits;
    });
    if (!this.pastVisits) {
      return;
    }
  }
}
