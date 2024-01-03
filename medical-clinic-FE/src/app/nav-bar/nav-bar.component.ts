import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../services/auth/token-storage.service';

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
  firstName?: string;
  lastName?: string;

  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit(): void {
    console.log('showNurseBoard ', this.showNurseBoard);
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();

      this.roles = user.roles;

      this.showDoctorBoard = this.roles.includes('ROLE_DOCTOR');
      this.showNurseBoard = this.roles.includes('ROLE_NURSE');

      this.username = user.username;
      this.id = user.id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
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
}
