import { Column, Entity, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsBoolean } from 'class-validator';

@Entity()
export class Offer extends GeneralEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'float' })
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
