export interface DoctorModel {
  id: number;
  name: string;
  surname: string;
}

// export interface RolesModel {
//   enumName: UserRole;
//   name: string;
// }

export enum UserRole {
  ROLE_USER = 'ROLE_USER',
  ROLE_NURSE = 'ROLE_NURSE',
  ROLE_DOCTOR = 'ROLE_DOCTOR',
}
