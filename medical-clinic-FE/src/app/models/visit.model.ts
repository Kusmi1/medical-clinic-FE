export interface VisitModel {
  visitId: string;
  specialization: string;
  doctorName: string;
  doctorSurname: string;
  price: number;
  userName: string;
  userSurname: string;
  date: string;
  hour: string;
  hours: HoursModel[];
  user: User;
  medicalClinic: MedicalClinic;
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
  email: string;
  pesel: string;
}

export interface MedicalClinic {
  id: number;
  name: string;
  street: string;
  cityName: string;
  houseNo: string;
  flatNo?: string;
  postalCode: string;
  city: string;
}

export interface VisitDetails {
  medicines: string;
  description: string;
  pin: string;
}
