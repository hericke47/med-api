import { createDoctor } from "./doctors.swagger";
import {
  createPatient,
  getAndUpdatePatient,
  listPatients,
} from "./patients.swagger";
import { authenticateDoctor, refreshDoctorToken } from "./sessions.swagger";

export default {
  "/sessions": authenticateDoctor,
  "/sessions/refreshToken": refreshDoctorToken,
  "/doctors": createDoctor,
  "/patients": createPatient,
  "/patients/{patientId}": getAndUpdatePatient,
  "/patients/": listPatients,
};
