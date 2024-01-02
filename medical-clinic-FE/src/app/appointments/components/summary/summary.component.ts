import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from '../../../guard/snackbar.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  visitDetails: any;
  visitId = 0;
  constructor(
    private route: ActivatedRoute,
    private appointmentsService: AppointmentsService,
    private readonly location: Location,
    private snackBar: MatSnackBar,
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const visitIdString = params.get('visitId');
      if (visitIdString) {
        this.visitId = Number(visitIdString);
        this.loadVisitById(this.visitId);
      }
    });
  }

  loadVisitById(visitId: number): void {
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
    this.appointmentsService.bookVisit(this.visitId).subscribe(
      response => {
        console.log(response); // Log the response if needed

        // Show a snackbar with the success message
        this.snackBarService.snackMessage('Wizyta umówiona poprawnie');
        setTimeout(() => {
          this.router.navigate(['/visit/future-visit']);
        }, 2000);
      },
      error => {
        console.error(error);
      }
    );
  }
}
