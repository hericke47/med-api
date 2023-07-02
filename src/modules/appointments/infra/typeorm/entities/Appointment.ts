import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";
import { Doctor } from "@modules/doctors/infra/typeorm/entities/Doctor";
import { Patient } from "@modules/patients/infra/typeorm/entities/Patient";
import { AppointmentStatus } from "./AppointmentStatus";

@Entity("appointments")
class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "timestamp" })
  date: Date;

  @Column({ type: "text", nullable: true })
  notes: string;

  @Column({ type: "uuid" })
  patient_id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patient_id" })
  patient: Patient;

  @Column({ type: "uuid" })
  doctor_id: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: "doctor_id" })
  doctor: Doctor;

  @Column({ type: "int" })
  appointment_status_id: number;

  @ManyToOne(() => AppointmentStatus)
  @JoinColumn({ name: "appointment_status_id" })
  appointmentStatus: AppointmentStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: "boolean" })
  active: boolean;

  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Appointment };
