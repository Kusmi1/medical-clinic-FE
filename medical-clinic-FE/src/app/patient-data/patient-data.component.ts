import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { AppointmentsService } from '../services/appointments-services/appointments.service';
import { UserModel } from '../models/user.model';
import { SnackbarService } from '../guard/snackbar.service';
import { TokenStorageService } from '../services/auth/token-storage.service';
import { ConfirmDialogComponent } from '../appointments/components/popup-window/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-patient-data',
  templateUrl: './patient-data.component.html',
  styleUrls: ['./patient-data.component.scss'],
})
export class PatientDataComponent implements OnInit {
  userData: UserModel | undefined;
  userForm: FormGroup;
  hidePassword = true;

  errorMessages = {
    firstName: [{ type: 'required', message: 'First Name is required.' }],
    lastName: [{ type: 'required', message: 'Last Name is required.' }],
    userName: [{ type: 'required', message: 'userName is required.' }],

    email: [
      { type: 'required', message: '' },
      { type: 'minlength', message: 'Email length.' },
      { type: 'maxlength', message: 'Email length.' },
      { type: 'pattern', message: 'please enter a valid email address.' },
    ],

    password: [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password is too short min 6.' },
      { type: 'maxlength', message: 'password length.' },
      { type: 'pattern', message: 'password is to easy.' },
    ],
    confirmpassword: [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password is too short min 6.' },
      { type: 'maxlength', message: 'password too long.' },
    ],
  };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private appointmentService: AppointmentsService,
    private tokenStorageService: TokenStorageService,
    private snackBar: SnackbarService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService
  ) {
    this.userForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.compose([Validators.required])),
      secondName: new FormControl(''),
      lastName: new FormControl('', Validators.compose([Validators.required])),
      userName: new FormControl({ value: '', disabled: true }),
      pesel: new FormControl({ value: '', disabled: true }),
      balance: new FormControl({ value: '', disabled: true }),

      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(6),
          Validators.maxLength(40),
          Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&].{1,}'
          ),
        ])
      ),
      confirmpassword: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30)])
      ),
    });
  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.appointmentService.getUser().subscribe(user => {
      this.userData = user;
      this.setUserId(user);
    });
  }

  setUserId(userData: UserModel) {
    this.userForm.get('firstName')?.setValue(userData.name);
    this.userForm.get('email')?.setValue(userData.email);
    this.userForm.get('pesel')?.setValue(userData.pesel);
    this.userForm.get('balance')?.setValue(userData.balance);
    this.userForm.get('userName')?.setValue(userData.userName);
    this.userForm.get('lastName')?.setValue(userData.lastname);
    this.userForm.get('password')?.setValue(userData.password);
    console.log('balance', this.userForm.get('balance')?.value);
  }

  get f() {
    return this.userForm.controls;
  }

  UpdateUserData(): void {
    const newUserData = {
      id: this.tokenStorageService.getUserId(),
      name: this.userForm.get('firstName')?.value,
      lastname: this.userForm.get('lastName')?.value,
      secondName: this.userForm.get('secondName')?.value,
      email: this.userForm.get('email')?.value,
      pesel: this.userForm.get('pesel')?.value,
    };
    this.appointmentService.UpdateUser(newUserData).subscribe(
      response => {
        this.snackBar.snackMessage('added-data-correctly');
        setTimeout(() => {
          this.router.navigate(['/visit/future-visit']);
        }, 1000);
      },
      error => {
        this.snackBar.snackMessage('added-data-wrong');
      }
    );
  }

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '340px',
      data: { message: 'delete-user' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appointmentService.deleteUser().subscribe(
          () => {
            this.snackBarService.snackMessage('deleted-user-correctly');
            setTimeout(() => {
              this.tokenStorageService.signOut();
              this.router.navigate(['/login']);
              setTimeout(() => {
                window.location.reload();
              }, 300);
            }, 800);
          },
          error => {
            this.snackBar.snackMessage('deleted-user-wrong');
          }
        );
      }
    });
  }
}
