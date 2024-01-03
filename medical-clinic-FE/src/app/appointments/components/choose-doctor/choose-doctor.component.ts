import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-choose-doctor',
  templateUrl: './choose-doctor.component.html',
  styleUrls: ['./choose-doctor.component.scss'],
})
export class ChooseDoctorComponent {
  @Input() AvailableHour: string[] = ['18:00', '19:00', '20:30'];
}
