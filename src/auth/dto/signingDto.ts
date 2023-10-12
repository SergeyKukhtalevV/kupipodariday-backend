import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class SigningDto extends PartialType(CreateUserDto) {
  @MinLength(1)
  @MaxLength(64)
  @IsString()
  username: string;

  @IsString()
  @MinLength(2)
  password: string;
}
