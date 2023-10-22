import {
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class UserProfileResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  username: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  about: string;

  @IsString()
  avatar: string;

  @IsEmail()
  email: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
