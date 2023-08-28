import { Entity, Column, ManyToOne } from 'typeorm';
import { IsUrl, MaxLength, MinLength } from 'class-validator';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { User } from '../../users/entity/user.entity';

@Entity()
export class WishList extends GeneralEntity {
  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
