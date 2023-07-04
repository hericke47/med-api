import {
  createAppointment,
  updateAndDeleteAppointment,
} from "./appointments.swagger";
import { createDoctor } from "./doctors.swagger";
import {
  createAndListPatient,
  getAndUpdateAndDeletePatient,
} from "./patients.swagger";
import { authenticateDoctor, refreshDoctorToken } from "./sessions.swagger";

export default {
  "/sessions": authenticateDoctor,
  "/sessions/refreshToken": refreshDoctorToken,
  "/doctors": createDoctor,
  "/patients": createAndListPatient,
  "/patients/{patientId}": getAndUpdateAndDeletePatient,
  "/appointments": createAppointment,
  "/appointments/{appointmentId}": updateAndDeleteAppointment,
};
