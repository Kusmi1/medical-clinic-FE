import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/auth/token-storage.service';
import { AppointmentsService } from '../services/appointments-services/appointments.service';
import { of } from 'rxjs';
import { UserModel } from '../models/book-visit.model';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  private roles: string[] = [];
  isLoggedIn = false;
  showDoctorBoard = false;
  showNurseBoard = false;
  username?: string;
  id?: string;
  userRole?: string;
  userList: UserModel | undefined;

  constructor(
    private tokenStorageService: TokenStorageService,
    private appointmentsService: AppointmentsService
  ) {}

  ngOnInit(): void {
    console.log('showNurseBoard ', this.showNurseBoard);
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      console.log('userList 2 ', this.userList);
      const user = this.tokenStorageService.getUser();
      this.mapRole(user.roles);
      this.getUserById();
      this.roles = user.roles;
      this.showDoctorBoard = this.roles.includes('ROLE_DOCTOR');
      this.showNurseBoard = this.roles.includes('ROLE_NURSE');
      // if (this.roles[0] != 'ROLE_USER') {
      //   this.userRole = user.roles;
      // }

      this.username = user.username;
      // this.username = this.firstName;
      this.id = user.id;
      console.log('id ', user.id);
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  userId() {
    console.log(this.tokenStorageService.getUserId());
  }
  getUserById() {
    this.appointmentsService.getUser().subscribe(user => {
      this.userList = user;

      console.log('this.surname in method ', this.userList);
    });
  }
  mapRole(roles: string[]) {
    if (this.roles[0] != 'ROLE_USER') {
      if (roles.includes('ROLE_DOCTOR')) {
        this.userRole = 'Lekarz';
      } else if (roles.includes('ROLE_NURSE')) {
        this.userRole = 'Pielęgniarka';
      }
    }
  }
}
