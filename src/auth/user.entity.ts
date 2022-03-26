import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';
import { Exclude } from 'class-transformer';

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
}
