import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  duration = 1500;
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  authError(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: this.duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['blue-snackbar'],
    });
  }
  registerInfo(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: this.duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['blue-snackbar'],
    });
  }

  snackMessage(messageKey: string) {
    const message = this.translate.instant('headers.' + messageKey);
    this.snackBar.open(message, 'OK', {
      duration: this.duration,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      // panelClass: ['blue-snackbar'],
    });
  }
}
