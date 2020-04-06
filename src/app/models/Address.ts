import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToMany(() => User, (user) => user.address)
  // user: User;

  @Column("varchar", {
    length: 100,
  })
  street: string;

  @Column("varchar", {
    length: 20,
  })
  state: string;

  @Column("varchar", {
    length: 100,
  })
  city: string;

  @Column("varchar", {
    length: 100,
  })
  district: string;

  @Column("varchar", {
    length: 10,
  })
  cep: string;
}
