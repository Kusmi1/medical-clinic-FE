import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';
import { RecentAppointmentsComponent } from './components/recent-appointments/recent-appointments.component';
import { NewAppointmentComponent } from './components/new-appointment/new-appointment.component';
import { SummaryComponent } from './components/summary/summary.component';
import { FutureAppointmentComponent } from './components/future-appointment/future-appointment.component';

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
      },
      { path: 'summary', component: SummaryComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppointmentsRoutingModule {}