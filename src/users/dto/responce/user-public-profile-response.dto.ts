import {
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  IsDateString,
} from 'class-validator';

export class UserPublicProfileResponseDto {
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
  @IsUrl()
  avatar: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
