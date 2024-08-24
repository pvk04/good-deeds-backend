import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.friends, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User)
  friend: User;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted';
}
