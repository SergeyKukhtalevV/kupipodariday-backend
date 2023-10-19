import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wish.dto';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @MinLength(1)
  @MaxLength(250)
  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  @IsOptional()
  price?: number;

  @MinLength(1)
  @MaxLength(1024)
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  @IsOptional()
  raised?: number;
}
