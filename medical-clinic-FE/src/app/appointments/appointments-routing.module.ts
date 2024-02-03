import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { RecentAppointmentsComponent } from './components/recent-appointments/recent-appointments.component';
import { NewAppointmentComponent } from './components/new-appointment/new-appointment.component';
import { SummaryComponent } from './components/summary/summary.component';
import { FutureAppointmentComponent } from './components/future-appointment/future-appointment.component';
import { AddNewAppointmentComponent } from './components/nurse/add-new-appointment/add-new-appointment.component';
import { ManageAppointmentsComponent } from './components/nurse/manage-appointments/manage-appointments.component';
import { AppointmentsPreviewComponent } from './components/doctor/appointments-preview/appointments-preview.component';
import { AddDoctorNurseComponent } from './components/nurse/add-doctor-nurse/add-doctor-nurse.component';
import { AuthenticationGuard as AuthGuard } from '../guard/authentication.guard';
import { AddBalanceComponent } from './components/nurse/add-balance/add-balance.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsComponent,
    children: [
      { path: 'recent', canActivate: [AuthGuard], component: RecentAppointmentsComponent },
      {
        path: 'future-visit',
        canActivate: [AuthGuard],
        component: FutureAppointmentComponent,
      },

      {
        path: 'new-visit',
        canActivate: [AuthGuard],
        component: NewAppointmentComponent,
        data: { title: 'New Visit' },
      },
      {
        path: 'summary/:visitId',
        canActivate: [AuthGuard],
        component: SummaryComponent,
      },
      {
        path: 'add',
        canActivate: [AuthGuard],
        component: AddNewAppointmentComponent,
      },
      {
        path: 'manage-appointments',
        canActivate: [AuthGuard],
        component: ManageAppointmentsComponent,
      },
      {
        path: 'preview-appointments',
        canActivate: [AuthGuard],
        component: AppointmentsPreviewComponent,
      },
      {
        path: 'new-role',
        canActivate: [AuthGuard],
        component: AddDoctorNurseComponent,
      },
      {
        path: 'add-balance',
        canActivate: [AuthGuard],
        component: AddBalanceComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
