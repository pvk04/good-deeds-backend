import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { GoodDeed } from '../good-deed/good-deed.entity';
import { Friendship } from '../friendship/friendship.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => GoodDeed, (goodDeed) => goodDeed.user)
  goodDeeds: GoodDeed[];

  @OneToMany(() => Friendship, (friendship) => friendship.user)
  friends: Friendship[];
}
