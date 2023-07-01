interface ICreateDoctorTokenDTO {
  doctorId: string;
  expiresDate: Date;
  refreshToken: string;
}

export { ICreateDoctorTokenDTO };
