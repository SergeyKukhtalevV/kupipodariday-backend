import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import {
  IsNumber,
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
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  price: number;

  @MinLength(1)
  @MaxLength(1024)
  @IsString()
  description: string;
}
