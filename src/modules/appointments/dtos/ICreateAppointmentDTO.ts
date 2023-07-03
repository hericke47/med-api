export default interface ICreateAppointmentDTO {
  date: Date;
  patientId: string;
  appointmentStatusId: number;
  doctorId: string;
}
