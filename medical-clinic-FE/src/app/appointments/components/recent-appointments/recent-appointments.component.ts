import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';
import { VisitDetails, VisitModel } from '../../../models/visit.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDetailsPopupComponent } from '../popup-window/appointment-details-popup/appointment-details-popup.component';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-recent-appointments',
  templateUrl: './recent-appointments.component.html',
  styleUrls: ['./recent-appointments.component.scss'],
})
export class RecentAppointmentsComponent implements OnInit {
  pastVisits: VisitModel[] | undefined;

  constructor(
    private appointmentsService: AppointmentsService,
    private router: Router,
    private dialog: MatDialog
  ) {}

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

  navigateToNewVisit(specializationName: string): void {
    this.router.navigate(['visit', 'new-visit'], {
      queryParams: { specialization: specializationName },
    });
  }

  openUpdateDialog(visitId: string) {
    this.getDetailsOfVisit(visitId).subscribe(visitDetails => {
      this.dialog.open(AppointmentDetailsPopupComponent, {
        width: '500px',
        height: '600px',
        data: {
          medicines: visitDetails.medicines,
          description: visitDetails.description,
        },
      });
    });
  }
  getDetailsOfVisit(visitId: string): Observable<VisitDetails> {
    return this.appointmentsService.getVisitDetailsByVisitId(visitId).pipe(
      tap(visitDetails => console.log('Visit Details retrieved successfully', visitDetails)),
      catchError(error => {
        console.error('There was an error retrieving the visit details', error);
        return throwError(error);
      })
    );
  }
}
