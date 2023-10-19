import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;
}
