import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  throwError,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate, Location } from '@angular/common';
import { HoursModel, VisitModel } from '../../../models/visit.model';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';
import { SpecializationModel } from '../../../models/specialization.model';
import { specializationMapping } from '../../../shared/specialization-mapping';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss'],
})
export class BookAppointmentComponent implements OnInit {
  visitForm: FormGroup;
  options: SpecializationModel[] = [];
  filteredOptions: Observable<SpecializationModel[]> | undefined;
  startDate: Date = new Date();
  availableVisits: VisitModel[] = [];
  specializationFromRoute = '';
  currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'pl');
  errorValue: any = null;
  showPin = false;
  constructor(
    private fb: FormBuilder,
    private readonly location: Location,
    private router: Router,
    private appointmentsService: AppointmentsService,
    private route: ActivatedRoute
  ) {
    this.visitForm = this.fb.group({
      specialization: ['', Validators.required],
      visit: [''],
      pin: new FormControl(
        '',
        Validators.compose([Validators.minLength(4), Validators.maxLength(4)])
      ),
      chosenDate: [''],
      chosenHour: this.fb.group({
        visitId: [null, Validators.required],
        hour: ['', Validators.required],
      }),
    });
    this.startDate.setDate(this.startDate.getDate() + 1);
  }

  ngOnInit() {
    this.specializationFromRoute = this.route.snapshot.queryParams['specialization'];
    if (this.specializationFromRoute) {
      this.visitForm.get('specialization')?.setValue(this.specializationFromRoute);
      this.filteredOptions = of([{ id: 0, name: this.specializationFromRoute }]);
    }

    this.loadSpecializations();
    this.filteredOptions = this.visitForm.controls['specialization'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.setupSpecializationListener();
  }

  private _filter(value: string): SpecializationModel[] {
    const filterValue = value.toLowerCase();

    return this.options!.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  cancelClicked() {
    this.location.back();
  }

  clickNext() {
    const visitId: string = this.visitForm.get('chosenHour.visitId')!.value;

    if (visitId) {
      this.router.navigate(['visit', 'summary', visitId]);
    }
    this.appointmentsService.pin = this.visitForm.get('pin')?.value;
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

  private setupSpecializationListener(): void {
    if (this.specializationFromRoute) {
      this.specializationControl.setValue(this.specializationFromRoute, { emitEvent: false });

      this.getVisits(this.specializationFromRoute).subscribe(visits => {
        this.availableVisits = visits;
      });
    }

    combineLatest([
      this.dateControl.valueChanges.pipe(startWith(this.dateControl.value)),
      this.specializationControl.valueChanges.pipe(startWith(this.specializationControl.value)),
    ])
      .pipe(
        filter(([date, specialization]) => specialization != ''),
        switchMap(() => this.getVisits())
      )
      .subscribe(visits => {
        this.availableVisits = visits;
      });
  }

  private getVisits(specializationRoute?: string): Observable<any[]> {
    const date: string | null = this.dateControl.value
      ? formatDate(this.dateControl.value, 'yyyy-MM-dd', 'pl')
      : null;
    let specialization = this.specializationControl.value;
    if (specializationRoute) {
      specialization = specializationRoute;
    }
    const polishSpecialization = specializationMapping[specialization] || specialization;
    return this.appointmentsService
      .getAvailableVisitsBySpecialization(polishSpecialization, date!)

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

  get dateControl(): FormControl {
    return this.visitForm.get('chosenDate') as FormControl;
  }

  get specializationControl(): FormControl {
    return this.visitForm.get('specialization') as FormControl;
  }

  toggleButtonState(selectedHour: HoursModel): void {
    this.availableVisits.forEach(visit => {
      visit.hours.forEach(hour => {
        hour.isSelected = false;
      });
    });
    this.visitForm.get('chosenHour')?.patchValue({
      visitId: selectedHour.visitId,
      hour: selectedHour.hour,
    });
    selectedHour.isSelected = true;
  }

  havePin() {
    this.showPin = true;
  }
}
