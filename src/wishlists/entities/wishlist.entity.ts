import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { IsUrl, MaxLength, MinLength } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends GeneralEntity {
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

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
