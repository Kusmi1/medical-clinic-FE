import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard as AuthGuard } from './guard/authentication.guard';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardNurseComponent } from './appointments/components/board-nurse/board-nurse.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'home', component: MainPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mod', component: BoardModeratorComponent },
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
