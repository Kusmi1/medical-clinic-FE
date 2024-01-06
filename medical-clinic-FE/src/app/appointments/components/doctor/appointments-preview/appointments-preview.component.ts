import { Component, OnInit } from '@angular/core';
import { HoursModel, VisitDetails, VisitModel } from '../../../../models/visit.model';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DoctorModel } from '../../../../models/doctor.model';
import { UserModel } from '../../../../models/user.model';
import { AppointmentsService } from '../../../../services/appointments-services/appointments.service';
import { SnackbarService } from '../../../../guard/snackbar.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../popup-window/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from '../../popup-window/input-dialog/input-dialog.component';
import { TokenStorageService } from '../../../../services/auth/token-storage.service';

@Component({
  selector: 'app-appointments-preview',
  templateUrl: './appointments-preview.component.html',
  styleUrls: ['./appointments-preview.component.scss'],
})
export class AppointmentsPreviewComponent implements OnInit {
  futureVisits: VisitModel[] | undefined;
  visitForm: FormGroup;
  userList: UserModel[] = [];
  filteredUsersByTerm: UserModel[] = [];
  userSearchControl = new FormControl();

  constructor(
    private appointmentsService: AppointmentsService,
    private tokenStorageService: TokenStorageService,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private location: Location,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.visitForm = this.fb.group({
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
    this.allUsers();
    this.loadFutureVisits();
    this.userSearchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.filteredUsersByTerm = this.filterUsersBySeachTerm(searchTerm);
      });
  }

  filterUsersBySeachTerm(searchTerm: string): UserModel[] {
    return this.filteredUsersByTerm.filter(
      user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  deleteVisit(visit: VisitModel) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Chcesz usunąć tą wizytę?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const visitId = this.getVisitIdFromHours(visit.hours);

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
    const doctorId = this.tokenStorageService.getUserId();

    return this.appointmentsService.getAllFutureBookedVisits(doctorId!, userId).pipe(
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

  setUserId(selectedUser: UserModel) {
    this.visitForm.get('user')?.patchValue({
      id: selectedUser.id,
      name: selectedUser.name,
      surname: selectedUser.lastname,
    });
  }

  resetForm() {
    this.visitForm.reset({
      specialization: '',
      userSearch: '',
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

  openInputDialog(visitId: string) {
    this.getDetailsOfVisit(visitId).subscribe(visitDetails => {
      const dialogRef = this.dialog.open(InputDialogComponent, {
        width: '500px',
        height: '550px',
        data: {
          medicines: visitDetails.medicines,
          description: visitDetails.description,
        },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.addDetailsToVisit(visitId, result as VisitDetails);
        } else {
          console.log('Dialog was cancelled');
        }
      });
    });
  }
  addDetailsToVisit(visitId: string, visitDetailsDto: VisitDetails) {
    this.appointmentsService.addVisitDetails(visitId, visitDetailsDto).subscribe(
      response => {
        this.snackBarService.snackMessage('Szczegóły dodane poprawnie');
      },
      error => {
        console.error('There was an error adding the visit details', error);
      }
    );
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
