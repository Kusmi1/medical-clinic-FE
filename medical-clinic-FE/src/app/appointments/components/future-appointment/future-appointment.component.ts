import { Component } from '@angular/core';
import { HoursModel, VisitModel } from '../../../models/visit.model';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../guard/snackbar.service';
import { Location } from '@angular/common';
import { ConfirmDialogComponent } from '../popup-window/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadFutureVisits();
  }

  loadFutureVisits(): void {
    this.appointmentsService.getFutureBookedVisits().subscribe(visits => {
      this.futureVisits = visits;
    });
  }

  deleteVisit(visit: VisitModel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'delete-visit' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const visitId = this.getVisitIdFromHours(visit.hours);

        this.appointmentsService.deleteVisit(visitId!).subscribe(
          () => {
            this.snackBarService.snackMessage('deleted-correctly');
            window.location.reload();
            setTimeout(() => {
              this.loadFutureVisits();
            }, 1500);
          },
          error => {
            console.error('Error:', error);
          }
        );
      }
    });
  }

  getVisitIdFromHours(hours: HoursModel[]): string | null {
    if (hours && hours.length > 0) {
      return hours[0].visitId;
    }
    return null;
  }
}
