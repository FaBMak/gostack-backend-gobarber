import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appoinments')
class Appoinment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  provider_id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider!: User;

  @Column('time with time zone')
  date!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  // Não usado com TypeORM
  // constructor({ provider, date }: Omit<Appoinment, 'id'>) {
  //   this.id = uuid();
  //   this.provider = provider;
  //   this.date = date;
  // }
}

export default Appoinment;
