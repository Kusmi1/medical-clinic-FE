import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { RecentAppointmentsComponent } from './components/recent-appointments/recent-appointments.component';
import { NewAppointmentComponent } from './components/new-appointment/new-appointment.component';
import { SummaryComponent } from './components/summary/summary.component';
import { FutureAppointmentComponent } from './components/future-appointment/future-appointment.component';
import { BoardNurseComponent } from './components/board-nurse/board-nurse.component';
import { ManageAppointmentsComponent } from './components/manage-appointments/manage-appointments.component';

const routes: Routes = [
  {
    path: '',
    component: AppointmentsComponent,
    children: [
      { path: 'recent', component: RecentAppointmentsComponent },
      {
        path: 'future-visit',
        component: FutureAppointmentComponent,
      },

      {
        path: 'new-visit',
        component: NewAppointmentComponent,
        data: { title: 'New Visit' },
      },
      {
        path: 'summary/:visitId',
        component: SummaryComponent,
      },
      {
        path: 'add',
        component: BoardNurseComponent,
      },
      {
        path: 'manage-appointments',
        component: ManageAppointmentsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}
