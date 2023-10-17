import {
  IsArray,
  IsInt,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
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
