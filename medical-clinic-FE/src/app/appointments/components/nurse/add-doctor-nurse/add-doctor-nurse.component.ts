import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../../models/user.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { AppointmentsService } from '../../../../services/appointments-services/appointments.service';
import { SnackbarService } from '../../../../guard/snackbar.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SpecializationModel } from '../../../../models/specialization.model';
import { UserRole } from '../../../../models/doctor.model';

@Component({
  selector: 'app-add-doctor-nurse',
  templateUrl: './add-doctor-nurse.component.html',
  styleUrls: ['./add-doctor-nurse.component.scss'],
})
export class AddDoctorNurseComponent implements OnInit {
  userList: UserModel[] = [];
  userSearchControl = new FormControl();
  roleForm: FormGroup;
  filteredUsersByTerm: UserModel[] = [];
  // filteredUsersByTerm: UserModel[] = [];
  options: SpecializationModel[] = [];
  filteredOptions: Observable<SpecializationModel[]> | undefined;
  userRole = ['ROLE_USER', 'ROLE_NURSE', 'ROLE_DOCTOR'];

  constructor(
    private appointmentsService: AppointmentsService,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private location: Location,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.roleForm = this.fb.group({
      userSearchControl: new FormControl(),
      role: [''],
      specialization: [''],
      userSearch: [''],
      user: this.fb.group({
        id: [''],
        name: [''],
        surname: [''],
      }),
    });
  }
  ngOnInit(): void {
    this.loadSpecializations();
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
    this.appointmentsService.getAllUsersByRole().subscribe(
      (users: UserModel[]) => {
        this.filteredUsersByTerm = users;
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }
  loadSpecializations() {
    this.appointmentsService.getAllSpecializations().subscribe(
      specializations => {
        this.options = specializations;
      },
      error => {
        console.error('Error fetching specializations', error);
      }
    );
  }

  resetForm() {
    this.roleForm.reset({
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
    this.roleForm.get('user')?.patchValue({
      id: selectedUser.id,
      name: selectedUser.name,
      surname: selectedUser.lastname,
    });
  }

  changeUserRole() {
    const specializationIds = this.roleForm.get('specialization')?.value;
    const newRole = this.roleForm.get('role')?.value;
    const userId = this.roleForm.get('user.id')?.value;
    this.appointmentsService
      .changeUserRoleAndHandleDoctor(userId, newRole, specializationIds)
      .subscribe(
        response => {
          this.snackBarService.snackMessage('role-changed-correctly');
          window.location.reload();
        },
        error => {
          this.snackBarService.snackMessage('role-changed-error');
          console.error('Error:', error);
        }
      );
  }
}
