import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("appointment_status")
class AppointmentStatus {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "text" })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export { AppointmentStatus };
