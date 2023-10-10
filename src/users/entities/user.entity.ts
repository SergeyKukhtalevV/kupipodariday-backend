import { Column, Entity } from 'typeorm';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { IsEmail, IsUrl, MaxLength, MinLength } from 'class-validator';

@Entity()
export class User extends GeneralEntity {
  @Column({ unique: true })
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @MinLength(2)
  @MaxLength(200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;
}
