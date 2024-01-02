export interface VisitModel {
  id: number;
  specialization: string;
  doctorName: string;
  doctorSurname: string;
  date: string;
  hour: string;
  hours: HoursModel[];
}

export interface HoursModel {
  visitId: number;
  hour: string;
  isSelected?: boolean;
}

interface Patient {
  id: number;
  name: string;
  secondName: string;
  surname: string;
  pesel: string;
}
