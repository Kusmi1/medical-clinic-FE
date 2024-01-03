import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';
import { filter, map, Observable, startWith, switchMap } from 'rxjs';
import { SpecializationModel } from '../../../models/specialization.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorModel } from '../../../models/doctor.model';
import { HoursModel } from '../../../models/visit.model';
import { SnackbarService } from '../../../guard/snackbar.service';
import { Router } from '@angular/router';
import { formatDate, Location } from '@angular/common';

@Component({
  selector: 'app-board-nurse',
  templateUrl: './board-nurse.component.html',
  styleUrls: ['./board-nurse.component.scss'],
})
export class BoardNurseComponent implements OnInit {
  filteredOptions: Observable<SpecializationModel[]> | undefined;
  visitForm: FormGroup;
  options: SpecializationModel[] = [];
  startDate: Date = new Date();
  doctors: DoctorModel[] = [];
  doctorUnavailable = false;

  constructor(
    private appointmentsService: AppointmentsService,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private location: Location,
    private router: Router
  ) {
    this.visitForm = this.fb.group({
      specialization: ['', Validators.required],

      chosenDate: ['', Validators.required],
      hour: ['', Validators.required],
      price: [0],

      doctor: this.fb.group({
        id: [null, Validators.required],
        name: [''],
        surname: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.loadSpecializations();
    this.filteredOptions = this.visitForm.controls['specialization'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.allDoctors();
    console.log;
  }

  private _filter(value: string): SpecializationModel[] {
    const filterValue = value.toLowerCase();

    return this.options!.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  clearResult() {
    this.visitForm.get('specialization')?.setValue('');
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

  allDoctors() {
    this.visitForm
      .get('specialization')
      ?.valueChanges.pipe(
        filter(specialization => specialization != ''),
        switchMap(specialization => {
          return this.appointmentsService.getDoctorsBySpecialization(specialization);
        })
      )
      .subscribe(
        doctors => {
          this.doctors = doctors;
        },
        error => {
          console.error('Error fetching available visits', error);
        }
      );
  }

  setDoctorId(selectedDoctor: DoctorModel) {
    this.visitForm.get('doctor')?.patchValue({
      id: selectedDoctor.id,
      name: selectedDoctor.name,
      surname: selectedDoctor.surname,
    });
    console.log('doctorId', this.visitForm.get('doctor')?.value);
  }

  addVisit(): void {
    const visitDate = formatDate(this.visitForm.get('chosenDate')?.value, 'yyy-MM-dd', 'pl');
    const doctorId = this.visitForm.get('doctor.id')?.value;
    const hours = this.visitForm.get('hour')?.value; // Replace with actual hours
    const price = this.visitForm.get('price')?.value; // Replace with actual price

    this.appointmentsService.addVisit(visitDate, doctorId, hours, price).subscribe(
      () => {
        this.snackBarService.snackMessage('Wizyta dodana poprawnie');
        this.doctorUnavailable = false;
        setTimeout(() => {
          this.resetForm();
        }, 2500);
      },

      error => {
        console.error('Error adding visit:', error);
        this.doctorUnavailable = true;
      }
    );
    console.log('visitDate', visitDate);
  }

  cancelClicked() {
    this.location.back();
  }
  resetForm() {
    this.visitForm.reset({
      specialization: '',
      chosenDate: '',
      hour: '',
      price: 0,
      doctor: {
        id: null,
        name: '',
        surname: '',
      },
    });
  }
}
