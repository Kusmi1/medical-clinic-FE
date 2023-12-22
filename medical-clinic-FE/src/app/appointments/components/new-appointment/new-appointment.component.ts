import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { VisitModel } from '../../../models/visit.model';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss'],
})
export class NewAppointmentComponent implements OnInit {
  visitForm: FormGroup;
  // specialization = new FormControl('');
  options: string[] = ['Kardiolog', 'Internista', 'Pediatra'];
  AvailableHour: string[] = ['18:00', '19:00', '20:30', '21:00'];
  visits: string[] = ['lek. Jan Kowalski', 'lek. Kamil Nowak'];
  filteredOptions: Observable<string[]> | undefined;
  // filteredVisits: Observable<string[]> | undefined;
  startDate: Date = new Date();
  availableVisits: VisitModel[] = [];
  constructor(
    private fb: FormBuilder,
    private readonly location: Location,
    private router: Router,
    private appointmentsService: AppointmentsService
  ) {
    this.visitForm = this.fb.group({
      specialization: [''],
      visit: [''],
      chosenDate: [''],
      chosenHour: [''],
    });
    this.startDate.setDate(this.startDate.getDate() + 1);
  }
  ngOnInit() {
    this.filteredOptions = this.visitForm.controls['specialization'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
    this.setupSpecializationListener();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterVisit(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.visits.filter(visit => visit.toLowerCase().includes(filterValue));
  }

  setupSpecializationListener(): void {
    this.visitForm
      .get('specialization')
      ?.valueChanges.pipe(
        switchMap(specialization =>
          this.appointmentsService.getAvailableVisitsBySpecialization(specialization)
        )
      )
      .subscribe(visits => {
        this.availableVisits = visits;
      });
  }

  cancelClicked() {
    this.location.back();
  }

  clickNext() {
    this.router.navigate(['visit', 'summary']);
  }

  get searchSelectedSpecializationControl(): FormControl {
    return this.visitForm.get('specialization') as FormControl;
  }
}
