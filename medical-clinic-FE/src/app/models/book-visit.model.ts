export interface BookVisitRequestModel {
  refundType: string;
  visitId: string;
  visits: Visit[];
}
interface Visit {
  patient: Patient;
  visitCode: string;
  visitType: string;
  service: { serviceCode: string }[];
}

interface Patient {
  name: string;
  surname: string;
  birthDate: string;
}

// interface Address {
//   country: string;
//   street: string;
//   cityName: string;
//   houseNo: string;
//   flatNo?: string;
//   postCode: string;
// }
