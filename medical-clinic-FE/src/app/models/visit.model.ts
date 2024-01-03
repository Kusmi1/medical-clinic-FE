export interface VisitModel {
  id: string;
  specialization: string;
  doctorName: string;
  doctorSurname: string;
  userName: string;
  userSurname: string;
  date: string;
  hour: string;
  hours: HoursModel[];
  user: User;
}

export interface HoursModel {
  visitId: string;
  hour: string;
  isSelected?: boolean;
}

interface User {
  id: number;
  name: string;
  secondName: string;
  surname: string;
  pesel: string;
}

export interface MedicalClinic {
  id: number;
  name: string;
  street: string;
  cityName: string;
  houseNo: string;
  flatNo?: string;
  postCode: string;
  city: string;
}
