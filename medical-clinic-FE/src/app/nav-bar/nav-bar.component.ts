import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/auth/token-storage.service';
import { AppointmentsService } from '../services/appointments-services/appointments.service';
import { UserModel } from '../models/user.model';

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
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.mapRole(user.roles);
      this.getUserById();
      this.roles = user.roles;
      this.showDoctorBoard = this.roles.includes('ROLE_DOCTOR');
      this.showNurseBoard = this.roles.includes('ROLE_NURSE');
      this.username = user.username;
      this.id = user.id;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  getUserById() {
    this.appointmentsService.getUser().subscribe(user => {
      this.userList = user;
    });
  }

  mapRole(roles: string[]) {
    if (this.roles[0] != 'ROLE_USER') {
      if (roles.includes('ROLE_DOCTOR')) {
        this.userRole = 'doctor';
      } else if (roles.includes('ROLE_NURSE')) {
        this.userRole = 'nurse';
      }
    }
  }
}
