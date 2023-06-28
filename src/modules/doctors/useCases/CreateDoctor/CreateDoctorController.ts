import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateDoctorUseCase } from "./CreateDoctorUseCase";

export class CreateDoctorController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createDoctor = container.resolve(CreateDoctorUseCase);

    const doctor = await createDoctor.execute({
      name,
      email,
      password,
    });

    return response.status(201).json(doctor);
  }
}
