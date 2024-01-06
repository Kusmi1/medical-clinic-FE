import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  hidePassword = true;
  hideconfirmPassword = true;
  public registrationMessage: string | null = null;
  registrationForm: FormGroup;
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

    pesel: [
      { type: 'required', message: '' },
      { type: 'minlength', message: 'pesel length.' },
      { type: 'maxlength', message: 'pesel length.' },
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
    private router: Router
  ) {
    this.registrationForm = this.formBuilder.group(
      {
        firstName: new FormControl('', Validators.compose([Validators.required])),
        secondName: new FormControl(''),
        lastName: new FormControl('', Validators.compose([Validators.required])),
        userName: new FormControl('', Validators.compose([Validators.required])),

        pesel: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(12),
          ])
        ),

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
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(30),
          ])
        ),
      },
      {
        validators: this.mustMatch('password', 'confirmpassword'),
      }
    );
  }

  onSubmit(): void {
    const { firstName, lastName, userName, email, pesel, password, secondName } =
      this.registrationForm.value;
    this.authService
      .register(firstName, lastName, userName, email, pesel, password, secondName)
      .subscribe({
        next: data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        },
        error: err => {
          this.errorMessage = err.error.message;
          this.isSignUpFailed = true;
        },
      });
  }

  mustMatch(password: any, confirmpassword: any) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmpassword];

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mustMatch']) {
        return;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  get f() {
    return this.registrationForm.controls;
  }

  goToLogin() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);

    if (!this.isSignUpFailed) {
      this.registrationMessage = 'User registered successfully!';
    }
  }
}
