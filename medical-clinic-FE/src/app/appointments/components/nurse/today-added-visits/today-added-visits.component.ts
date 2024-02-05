import { Component } from '@angular/core';
import { HoursModel, VisitModel } from '../../../../models/visit.model';
import { ConfirmDialogComponent } from '../../popup-window/confirm-dialog/confirm-dialog.component';
import { AppointmentsService } from '../../../../services/appointments-services/appointments.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../../guard/snackbar.service';
import { formatDate, Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
  throwError,
} from 'rxjs';
import { SpecializationModel } from '../../../../models/specialization.model';
import { specializationMapping } from '../../../../shared/specialization-mapping';

@Component({
  selector: 'app-today-added-visits',
  templateUrl: './today-added-visits.component.html',
  styleUrls: ['./today-added-visits.component.scss'],
})
export class TodayAddedVisitsComponent {
  todayVisits: VisitModel[] | undefined;
  visitForm: FormGroup;
  filteredOptions: Observable<SpecializationModel[]> | undefined;
  options: SpecializationModel[] = [];
  errorValue: any = null;

  constructor(
    private fb: FormBuilder,
    private appointmentsService: AppointmentsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private snackBarService: SnackbarService,
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.visitForm = this.fb.group({
      specialization: [''],
    });
  }
  ngOnInit(): void {
    this.loadFutureVisits();
    this.loadSpecializations();
    this.setupSpecializationListener();

    this.filteredOptions = this.visitForm.controls['specialization'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private loadFutureVisits(): void {
    this.appointmentsService.getAllTodayAddVisits().subscribe(
      data => (this.todayVisits = data),
      error => console.error(error)
    );
  }

  private setupSpecializationListener(): void {
    combineLatest([
      this.specializationControl.valueChanges.pipe(startWith(this.specializationControl.value)),
    ])
      .pipe(
        filter(([specialization]) => specialization != ''),
        switchMap(() => this.getVisits())
      )
      .subscribe(visits => {
        this.todayVisits = visits;
      });
  }

  get specializationControl(): FormControl {
    return this.visitForm.get('specialization') as FormControl;
  }

  private getVisits(): Observable<any[]> {
    const specialization = this.specializationControl.value;

    const polishSpecialization = specializationMapping[specialization] || specialization;
    return this.appointmentsService
      .getAllTodayAddVisits(polishSpecialization)

      .pipe(
        map(visits => {
          return visits;
        }),
        catchError(error => {
          this.errorValue = error.status;
          return throwError(error);
        })
      );
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

            setTimeout(() => {
              localStorage.setItem('balanceAvailable', 'true');
              window.location.reload();
            }, 2000);
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

  clearResult() {
    this.visitForm.get('specialization')?.setValue('');
  }

  loadSpecializations() {
    this.appointmentsService.getAllSpecializations().subscribe(
      specializations => {
        this.options = specializations;
      },
      error => {
        console.error('Error fetching specializations', error);
      }
    );
  }

  private _filter(value: string): SpecializationModel[] {
    const filterValue = value.toLowerCase();
    return this.options!.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  clearForm() {
    this.loadFutureVisits();
    this.clearResult();
  }
}
