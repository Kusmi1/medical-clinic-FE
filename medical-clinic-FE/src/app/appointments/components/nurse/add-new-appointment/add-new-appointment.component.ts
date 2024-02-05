import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../../services/appointments-services/appointments.service';
import { filter, map, Observable, startWith, switchMap } from 'rxjs';
import { SpecializationModel } from '../../../../models/specialization.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorModel } from '../../../../models/doctor.model';
import { HoursModel, MedicalClinic } from '../../../../models/visit.model';
import { SnackbarService } from '../../../../guard/snackbar.service';
import { Router } from '@angular/router';
import { formatDate, Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { specializationMapping } from '../../../../shared/specialization-mapping';

@Component({
  selector: 'app-add-new-appointment',
  templateUrl: './add-new-appointment.component.html',
  styleUrls: ['./add-new-appointment.component.scss'],
})
export class AddNewAppointmentComponent implements OnInit {
  filteredOptions: Observable<SpecializationModel[]> | undefined;
  filteredClinics: Observable<MedicalClinic[]> | undefined;
  visitForm: FormGroup;
  options: SpecializationModel[] = [];
  clinicList: MedicalClinic[] = [];
  startDate: Date = new Date();
  doctors: DoctorModel[] = [];
  doctorUnavailable = false;
  steps: number[] = [10, 15, 30, 45, 60];

  constructor(
    private appointmentsService: AppointmentsService,
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private location: Location,
    private router: Router,
    private translate: TranslateService
  ) {
    this.visitForm = this.fb.group({
      specialization: ['', Validators.required],

      chosenDate: ['', Validators.required],
      hourStart: ['', Validators.required],
      hourEnd: ['', Validators.required],
      hourStep: ['', Validators.required],
      balance: ['0'],

      doctor: this.fb.group({
        id: [null, Validators.required],
        name: [''],
        surname: [''],
      }),

      medicalClinic: this.fb.group({
        id: [null],
        name: [''],
        street: [''],
        cityName: [''],
        houseNo: [''],
        flatNo: [''],
        postCode: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.loadSpecializations();
    this.loadMedicalClinic();
    this.filteredOptions = this.visitForm.controls['specialization'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.filteredClinics = this.visitForm
      .get('medicalClinic')
      ?.get('name')
      ?.valueChanges.pipe(
        startWith(''),
        map(value => this.filterClinics(value || ''))
      );
    this.allDoctors();
  }

  private _filter(value: string): SpecializationModel[] {
    const filterValue = value.toLowerCase();

    return this.options!.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private filterClinics(value: string): MedicalClinic[] {
    const filterValue = value.toLowerCase();

    return this.clinicList!.filter(option => option.name.toLowerCase().includes(filterValue));
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

  loadMedicalClinic() {
    this.appointmentsService.getAllMedicalClinics().subscribe(
      clinics => {
        this.clinicList = clinics;
      },
      error => {
        console.error('Error fetching clinics', error);
      }
    );
  }

  allDoctors() {
    this.visitForm
      .get('specialization')
      ?.valueChanges.pipe(
        filter(specialization => specialization != ''),
        switchMap(specialization => {
          const polishSpecialization = specializationMapping[specialization] || specialization;
          return this.appointmentsService.getDoctorsBySpecialization(polishSpecialization);
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
  }

  setClinicId(selectedClinic: MedicalClinic) {
    this.visitForm.get('medicalClinic')?.patchValue({
      id: selectedClinic.id,
    });
  }

  addVisit(): void {
    const visitDate = formatDate(this.visitForm.get('chosenDate')?.value, 'yyy-MM-dd', 'pl');
    const doctorId = this.visitForm.get('doctor.id')?.value;
    const hourStart = this.visitForm.get('hourStart')?.value;
    const hourEnd = this.visitForm.get('hourEnd')?.value;
    const hourStep = this.visitForm.get('hourStep')?.value;
    const price = this.visitForm.get('balance')?.value;
    const clinicId = this.visitForm.get('medicalClinic.id')?.value;

    this.appointmentsService
      .addVisit(visitDate, doctorId, hourStart, hourEnd, hourStep, price, clinicId)
      .subscribe(
        () => {
          this.snackBarService.snackMessage('added-correctly');
          this.doctorUnavailable = false;
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },

        error => {
          console.error('Error adding visit:', error);
          this.doctorUnavailable = true;
        }
      );
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

  setStep(choosenStep: number) {
    this.visitForm.get('hourStep')?.setValue(choosenStep);
  }
}
