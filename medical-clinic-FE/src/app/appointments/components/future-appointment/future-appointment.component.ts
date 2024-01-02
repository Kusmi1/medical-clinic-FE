import { Component } from '@angular/core';
import { HoursModel, VisitModel } from '../../../models/visit.model';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../guard/snackbar.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-future-appointment',
  templateUrl: './future-appointment.component.html',
  styleUrls: ['./future-appointment.component.scss'],
})
export class FutureAppointmentComponent {
  futureVisits: VisitModel[] | undefined;
  constructor(
    private appointmentsService: AppointmentsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private snackBarService: SnackbarService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadFutureVisits();
  }

  loadFutureVisits(): void {
    this.appointmentsService.getFutureBookedVisits().subscribe(visits => {
      console.log('Received visits:', visits);
      this.futureVisits = visits;
    });
  }

  deleteVisit(visit: VisitModel) {
    const visitId = this.getVisitIdFromHours(visit.hours);
    console.log('visitId ', visitId);
    visit.hours[0].visitId;
    this.appointmentsService.deleteVisit(visitId!).subscribe(
      () => {
        this.snackBarService.snackMessage('Wizyta usunięta poprawnie');
        setTimeout(() => {
          this.loadFutureVisits();
        }, 2000);
      },
      error => {
        console.error('Error:', error);
      }
    );
    console.log('visitId2 ', visitId);
  }
  getVisitIdFromHours(hours: HoursModel[]): number | null {
    if (hours && hours.length > 0) {
      return hours[0].visitId;
    }
    return null;
  }
}
