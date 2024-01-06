import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { AppointmentsRoutingModule } from './appointments-routing.module';
import { RecentAppointmentsComponent } from './components/recent-appointments/recent-appointments.component';
import { AppointmentsCardComponent } from './components/appointments-card/appointments-card.component';
import { AppointmentsComponent } from './appointments.component';
import { SummaryComponent } from './components/summary/summary.component';

import { NewAppointmentComponent } from './components/new-appointment/new-appointment.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FutureAppointmentComponent } from './components/future-appointment/future-appointment.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ManageAppointmentsComponent } from './components/nurse/manage-appointments/manage-appointments.component';
import { ConfirmDialogComponent } from './components/popup-window/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AppointmentsPreviewComponent } from './components/doctor/appointments-preview/appointments-preview.component';
import { InputDialogComponent } from './components/popup-window/input-dialog/input-dialog.component';
import { AppointmentDetailsPopupComponent } from './components/popup-window/appointment-details-popup/appointment-details-popup.component';
@NgModule({
  declarations: [
    RecentAppointmentsComponent,
    AppointmentsCardComponent,
    AppointmentsComponent,
    SummaryComponent,
    NewAppointmentComponent,
    FutureAppointmentComponent,
    ManageAppointmentsComponent,
    ConfirmDialogComponent,
    AppointmentsPreviewComponent,
    InputDialogComponent,
    AppointmentDetailsPopupComponent,
  ],
  exports: [NewAppointmentComponent],
  imports: [
    CommonModule,
    AppointmentsRoutingModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    TranslateModule,
    FormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSnackBarModule,
    MatRadioModule,
    MatDialogModule,
  ],
})
export class AppointmentsModule {}
