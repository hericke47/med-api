import { createDoctor } from "./doctors.swagger";
import { authenticateDoctor, refreshDoctorToken } from "./sessions.swagger";

export default {
  "/doctors": createDoctor,
  "/sessions": authenticateDoctor,
  "/sessions/refreshToken": refreshDoctorToken,
};
