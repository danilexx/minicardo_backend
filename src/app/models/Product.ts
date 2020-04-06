import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {
    length: 100,
  })
  name: string;

  @ManyToOne(() => User, (user) => user.products)
  user: User;

  @Column("double precision")
  price: number;
}
