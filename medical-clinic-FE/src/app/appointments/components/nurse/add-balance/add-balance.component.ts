import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../../models/user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SpecializationModel } from '../../../../models/specialization.model';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { AppointmentsService } from '../../../../services/appointments-services/appointments.service';
import { SnackbarService } from '../../../../guard/snackbar.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-balance',
  templateUrl: './add-balance.component.html',
  styleUrls: ['./add-balance.component.scss'],
})
export class AddBalanceComponent implements OnInit {
  userList: UserModel[] = [];
  userSearchControl = new FormControl();
  balanceForm: FormGroup;
  filteredUsersByTerm: UserModel[] = [];
  options: SpecializationModel[] = [];

  constructor(
    private appointmentsService: AppointmentsService,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private location: Location,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.balanceForm = this.fb.group({
      userSearchControl: new FormControl(),
      balance: ['', Validators.required],
      userSearch: [''],
      user: this.fb.group({
        id: [''],
        name: [''],
        surname: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.allUsers();

    this.userSearchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(searchTerm => {
        this.filteredUsersByTerm = this.filterUsersBySeachTerm(searchTerm);
      });
  }

  filterUsersBySeachTerm(searchTerm: string): UserModel[] {
    if (searchTerm != '') {
      return this.filteredUsersByTerm.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return this.filteredUsersByTerm;
  }

  allUsers() {
    this.appointmentsService.getAllUsers().subscribe(
      (users: UserModel[]) => {
        this.filteredUsersByTerm = users;
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }

  resetForm() {
    this.balanceForm.reset({
      specialization: '',
      userSearchControl: '',
      role: '',
      user: {
        id: null,
        name: '',
        surname: '',
      },
    });
    this.allUsers();
  }

  setUserId(selectedUser: UserModel) {
    this.balanceForm.get('user')?.patchValue({
      id: selectedUser.id,
      name: selectedUser.name,
      surname: selectedUser.lastname,
    });
  }

  addBalance() {
    const userId = this.balanceForm.get('user.id')?.value;
    const balance = this.balanceForm.get('balance')?.value;
    console.log('USERID ', userId, ' balance ', balance);
    this.appointmentsService.addBalance(balance, userId).subscribe(
      response => {
        this.snackBarService.snackMessage('added-correctly');
        window.location.reload();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
}
