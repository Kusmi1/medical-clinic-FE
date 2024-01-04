import { Component, OnInit } from '@angular/core';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { SpecializationModel } from '../../../../models/specialization.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DoctorModel } from '../../../../models/doctor.model';
import { AppointmentsService } from '../../../../services/appointments-services/appointments.service';
import { SnackbarService } from '../../../../guard/snackbar.service';
import { formatDate, Location } from '@angular/common';
import { Router } from '@angular/router';
import { HoursModel, VisitModel } from '../../../../models/visit.model';
import { UserModel } from '../../../../models/book-visit.model';
import { ConfirmDialogComponent } from '../../popup-window/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-manage-appointments',
  templateUrl: './manage-appointments.component.html',
  styleUrls: ['./manage-appointments.component.scss'],
})
export class ManageAppointmentsComponent implements OnInit {
  futureVisits: VisitModel[] | undefined;
  filteredOptions: Observable<SpecializationModel[]> | undefined;
  visitForm: FormGroup;
  options: SpecializationModel[] = [];
  doctors: DoctorModel[] = [];
  filteredUsersByTerm: UserModel[] = [];
  userList: UserModel[] = [];
  userSearchControl = new FormControl();

  constructor(
    private appointmentsService: AppointmentsService,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private location: Location,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.visitForm = this.fb.group({
      userSearchControl: new FormControl(),
      specialization: [''],
      userSearch: [''],
      user: this.fb.group({
        id: [null],
        name: [''],
        surname: [''],
      }),
      doctor: this.fb.group({
        id: [null, Validators.required],
        name: [''],
        surname: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.loadSpecializations();
    this.allDoctors();
    this.allUsers();
    this.loadFutureVisits();
    this.userSearchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.filteredUsersByTerm = this.filterUsersBySeachTerm(searchTerm);
      });
    this.filteredOptions = this.visitForm.controls['specialization'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): SpecializationModel[] {
    const filterValue = value.toLowerCase();

    return this.options!.filter(option => option.name.toLowerCase().includes(filterValue));
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

  filterUsersBySeachTerm(searchTerm: string): UserModel[] {
    console.log('searchTerm', searchTerm);
    if (searchTerm != '') {
      return this.filteredUsersByTerm.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.surname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else console.log('else searchTerm', searchTerm);
    return this.filteredUsersByTerm;
  }

  allUsers() {
    this.appointmentsService.getAllUsers().subscribe(
      users => {
        this.filteredUsersByTerm = users;
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }

  allDoctors() {
    this.visitForm
      .get('specialization')
      ?.valueChanges.pipe(
        filter(specialization => specialization != ''),
        switchMap(specialization => {
          return this.appointmentsService.getDoctorsBySpecialization(specialization);
        })
      )
      .subscribe(
        doctors => {
          this.doctors = doctors;
        },
        error => {
          console.error('Error fetching available visits', error);
        }
      );
  }

  deleteVisit(visit: VisitModel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Chcesz usunąć tą wizytę?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const visitId = this.getVisitIdFromHours(visit.hours);
        console.log('visitId ', visitId);

        this.appointmentsService.deleteVisit(visitId!).subscribe(
          () => {
            this.snackBarService.snackMessage('Wizyta usunięta poprawnie');
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

  private loadFutureVisits(): void {
    combineLatest([
      this.doctorControl.valueChanges.pipe(startWith(this.doctorControl.value)),
      this.userControl.valueChanges.pipe(startWith(this.userControl.value)),
    ])
      .pipe(switchMap(() => this.getVisits()))
      .subscribe(visits => {
        this.futureVisits = visits;
      });
  }

  private getVisits(): Observable<any[]> {
    const userId = this.userControl.value;
    const doctorId = this.doctorControl.value;

    console.log('doctorId ', doctorId);
    console.log('userId ', userId);

    return this.appointmentsService.getAllFutureBookedVisits(doctorId, userId).pipe(
      map(visits => {
        return visits;
      })
    );
  }

  get doctorControl(): FormControl {
    return this.visitForm.get('doctor.id') as FormControl;
  }

  get userControl(): FormControl {
    return this.visitForm.get('user.id') as FormControl;
  }

  setDoctorId(selectedDoctor: DoctorModel) {
    this.visitForm.get('doctor')?.patchValue({
      id: selectedDoctor.id,
      name: selectedDoctor.name,
      surname: selectedDoctor.surname,
    });
    console.log('doctor ', this.visitForm.get('doctor')?.value);
  }

  setUserId(selectedUser: DoctorModel) {
    this.visitForm.get('user')?.patchValue({
      id: selectedUser.id,
      name: selectedUser.name,
      surname: selectedUser.surname,
    });
    console.log('user ', this.visitForm.get('user')?.value);
  }

  resetForm() {
    this.visitForm.reset({
      specialization: '',
      userSearchControl: '',
      user: {
        id: null,
        name: '',
        surname: '',
      },
      doctor: {
        id: null,
        name: '',
        surname: '',
      },
    });
    this.allUsers();
  }
}
