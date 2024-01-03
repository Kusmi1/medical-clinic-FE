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

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { ChooseDoctorComponent } from './components/choose-doctor/choose-doctor.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FutureAppointmentComponent } from './components/future-appointment/future-appointment.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ManageAppointmentsComponent } from './components/manage-appointments/manage-appointments.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({
  declarations: [
    RecentAppointmentsComponent,
    AppointmentsCardComponent,
    AppointmentsComponent,
    SummaryComponent,
    NewAppointmentComponent,
    ChooseDoctorComponent,
    FutureAppointmentComponent,
    ManageAppointmentsComponent,
    ConfirmDialogComponent,
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
