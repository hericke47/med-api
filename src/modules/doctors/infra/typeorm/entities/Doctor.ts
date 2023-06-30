import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidV4 } from "uuid";

@Entity("doctors")
class Doctor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  name: string;

  @Column({ length: 200, type: "varchar" })
  email: string;

  @Column({ length: 200, type: "varchar" })
  password: string;

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

export { Doctor };
