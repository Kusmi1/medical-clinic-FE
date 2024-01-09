import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { TokenStorageService } from '../services/auth/token-storage.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';
import { CustomErrorStateMatcher } from './CustomErrorStateMatcher';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    {
      provide: ErrorStateMatcher,
      useClass: CustomErrorStateMatcher,
    },
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  matcher: CustomErrorStateMatcher = new CustomErrorStateMatcher();
  hide = true;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  errorMessages = {
    username: [
      { type: 'required', message: 'Email is required.' },
      { type: 'minlength', message: 'Email length.' },
      { type: 'maxlength', message: 'Email length.' },
      { type: 'pattern', message: 'please enter a valid email address.' },
    ],

    password: [
      { type: 'required', message: 'password is required.' },
      { type: 'minlength', message: 'password is too short min 6.' },
      { type: 'maxlength', message: 'password length.' },
    ],
  };
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30)])
      ),
    });
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
    setTimeout(() => {
      this.router.navigate(['/visit/future-visit']);
    }, 2500);
  }
}
