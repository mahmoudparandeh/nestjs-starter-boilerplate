import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @Column()
  ip: string;

  @Column()
  userAgent: string;

  @Column()
  request: string;

  @Column()
  error: string;

  @Column()
  type: string;

  @Column()
  body: string;

  @Column()
  query: string;

  @Column()
  stack: string;

  @Column()
  userId: number;

  @Column()
  auth: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;
}
