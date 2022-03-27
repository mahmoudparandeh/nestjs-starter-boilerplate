import {
  BeforeInsert, BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { Exclude } from 'class-transformer';
import * as argon2 from 'argon2';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @OneToMany(() => Task, (task) => task.user, { eager: true })
  @Exclude({
    toPlainOnly: true,
  })
  tasks: Task[];

  @Column()
  @CreateDateColumn()
  @Exclude({
    toPlainOnly: true,
  })
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  @Exclude({
    toPlainOnly: true,
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    this.password = await argon2.hash(this.password);
  }
}
