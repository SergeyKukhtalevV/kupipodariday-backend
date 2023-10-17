import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';
import {
  IsArray,
  IsInt,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @MinLength(1)
  @MaxLength(250)
  @IsString()
  name: string;

  @MaxLength(1500)
  @IsString()
  description: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsInt({ each: true })
  items: number[];
}
