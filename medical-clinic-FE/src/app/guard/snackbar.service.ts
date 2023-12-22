import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  authError(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['blue-snackbar'],
    });
  }
  registerInfo(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['blue-snackbar'],
    });
  }
}