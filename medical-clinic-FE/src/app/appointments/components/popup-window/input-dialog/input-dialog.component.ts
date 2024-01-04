import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
})
export class InputDialogComponent {
  medicines = '';
  description = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.medicines = data.medicines;
    this.description = data.description;
  }
}
