import { Entity, Column, ManyToOne } from 'typeorm';
import { IsUrl, MaxLength, MinLength } from 'class-validator';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { User } from '../../users/entity/user.entity';

@Entity()
export class Wish extends GeneralEntity {
  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  avatar: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float' })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @Column()
  copied: number;
}
