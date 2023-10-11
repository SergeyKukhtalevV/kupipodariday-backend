import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @MinLength(1)
  @MaxLength(64)
  @IsString()
  username: string;

  @MinLength(2)
  @MaxLength(200)
  @IsString()
  @IsOptional()
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(2)
  password: string;
}
