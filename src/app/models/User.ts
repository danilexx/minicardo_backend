import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  BeforeInsert,
  JoinTable,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";

import { Address } from "./Address";
import { Product } from "./Product";
import { File } from "./File";

@Entity()
export class User extends BaseEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.passwordHash = await bcrypt.hash(this.password, 8);
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => File, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  icon: File;

  @OneToOne(() => File, {
    eager: true,
    nullable: true,
    cascade: true,
  })
  @JoinColumn()
  post: File;

  @Column("varchar", {
    length: 150,
  })
  name: string;

  @Column("varchar", {
    length: 100,
  })
  email: string;

  @Column("int", {
    default: 0,
  })
  clicked: number;

  @Column("enum", {
    enum: ["trader", "deliveryman"],
  })
  type: "trader" | "deliveryman";

  @Column("varchar", {
    nullable: true,
  })
  productType: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  address: Address;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @Column("varchar", {
    select: false,
  })
  passwordHash: string;

  password: string;

  @Column("varchar", {
    length: 15,
  })
  zap: string;

  async checkPassword(password) {
    if (!this.passwordHash) {
      const { passwordHash } = await User.findOne(this.id, {
        select: ["passwordHash"],
      });
      this.passwordHash = passwordHash;
    }
    return bcrypt.compare(password, this.passwordHash);
  }

  generateToken() {
    return jwt.sign(
      { id: this.id, email: this.email, name: this.name, type: this.type },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      }
    );
  }
}
