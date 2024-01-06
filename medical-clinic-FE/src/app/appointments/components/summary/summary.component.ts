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
  visitIdString = '';
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
      this.visitIdString = params.get('visitId')!;
      if (this.visitIdString) {
        this.loadVisitById(this.visitIdString);
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
    this.appointmentsService.bookVisit(this.visitIdString).subscribe(
      response => {
        console.log(response);
        this.snackBarService.snackMessage('Wizyta umówiona poprawnie');
        setTimeout(() => {
          this.router.navigate(['/visit/future-visit']);
        }, 1500);
      },
      error => {
        console.error(error);
      }
    );
  }
}
