import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/auth/user.service';
import { TokenStorageService } from '../services/auth/token-storage.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {}

//   content?: string;
//
//   constructor(private userService: UserService) {}
//
//   ngOnInit(): void {
//     this.userService.getPublicContent().subscribe({
//       next: data => {
//         this.content = data;
//       },
//       error: err => {
//         this.content = JSON.parse(err.error).message;
//       },
//     });
//   }
// }
