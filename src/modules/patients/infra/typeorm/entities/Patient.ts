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
import { Gender } from "./Gender";

@Entity("patients")
class Patient {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ type: "varchar", length: 20 })
  phone: string;

  @Column({ type: "varchar", length: 200 })
  email: string;

  @Column({ type: "int" })
  height: number;

  @Column({ type: "numeric", precision: 3, scale: 1 })
  weight: number;

  @Column({ type: "date" })
  birth_date: Date;

  @Column({ type: "int" })
  gender_id: number;

  @ManyToOne(() => Gender)
  @JoinColumn({ name: "gender_id" })
  gender: Gender;

  @Column({ type: "uuid" })
  doctor_id: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: "doctor_id" })
  doctor: Doctor;

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

export { Patient };
