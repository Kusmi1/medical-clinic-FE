import { Component, OnInit } from '@angular/core';
import { AppointmentsService } from '../../../services/appointments-services/appointments.service';
import { map, Observable, startWith } from 'rxjs';
import { SpecializationModel } from '../../../models/specialization.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private appointmentsService: AppointmentsService,
    private fb: FormBuilder
  ) {
    this.visitForm = this.fb.group({
      specialization: ['', Validators.required],
      visit: [''],
      chosenDate: [''],
      doctor: [''],
    });
  }

  ngOnInit(): void {
    this.loadSpecializations();
    this.filteredOptions = this.visitForm.controls['specialization'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
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
}
