import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { BaseEntity } from '@shared/infrastructure/entities/BaseEntity';

@Entity('users')
export default class UserEntity extends BaseEntity  {
  @PrimaryColumn('uuid')
  public id!: string;

  @Column()
  public name!: string;

  @Column({ unique: true })
  public email!: string;

  @Column()
  public password!: string;
}
