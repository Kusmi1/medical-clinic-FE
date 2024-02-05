import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../guard/snackbar.service';
import { UserModel } from '../../../models/user.model';
import { ConfirmDialogComponent } from '../popup-window/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  visitDetails: any;
  visitId = 0;
  visitIdString = '';
  userList: UserModel | undefined;
  errorValue: any = null;
  private balanceValue: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private appointmentsService: AppointmentsService,
    private readonly location: Location,
    private snackBar: MatSnackBar,
    private router: Router,
    private snackBarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.visitIdString = params.get('visitId')!;
      if (this.visitIdString) {
        this.loadVisitById(this.visitIdString);
        this.getUserById();
      }
    });
  }

  loadVisitById(visitId: string): void {
    this.appointmentsService.getVisitById(visitId).subscribe(
      details => {
        this.visitDetails = details;
      },
      error => {
        console.error('Error fetching visit details', error);
      }
    );
  }

  goBack() {
    this.location.back();
  }

  bookVisit() {
    if (this.visitDetails.price > 0) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '340px',
        data: { message: 'paid-visit' },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.bookVisitRequest();
        }
      });
    } else {
      this.bookVisitRequest();
    }
  }

  private bookVisitRequest() {
    this.appointmentsService.bookVisit(this.visitIdString, this.appointmentsService.pin).subscribe(
      response => {
        this.snackBarService.snackMessage('made-appointment');
        setTimeout(() => {
          this.router.navigate(['/visit/future-visit'], {
            queryParams: { balanceAvailable: 'true' },
          });
        }, 1500);
      },
      error => {
        this.errorValue = error.status;
        this.snackBarService.snackMessage('error-409');
        setTimeout(() => {
          this.router.navigate(['/visit/new-visit']);
        }, 2000);
      }
    );
  }
  getUserById() {
    this.appointmentsService.getUser().subscribe(user => {
      this.userList = user;
      this.balanceValue = user.balance;
    });
  }
}
