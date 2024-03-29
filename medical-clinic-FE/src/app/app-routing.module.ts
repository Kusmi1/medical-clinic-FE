import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard as AuthGuard } from './guard/authentication.guard';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddNewAppointmentComponent } from './appointments/components/nurse/add-new-appointment/add-new-appointment.component';
import { PatientDataComponent } from './patient-data/patient-data.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'home', component: MainPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', canActivate: [AuthGuard], component: PatientDataComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'visit',
    loadChildren: () =>
      import('./appointments/appointments.module').then(m => m.AppointmentsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
