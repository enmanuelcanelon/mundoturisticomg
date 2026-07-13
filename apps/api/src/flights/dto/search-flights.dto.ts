import {
  IsString,
  IsOptional,
  IsDateString,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsIn,
} from 'class-validator';
import { CabinClass } from '@prisma/client';
import { Type } from 'class-transformer';

export class SearchFlightsDto {
  @IsString()
  origin!: string; // city id or IATA

  @IsString()
  destination!: string;

  @IsDateString()
  departureDate!: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsIn(['oneway', 'roundtrip'])
  tripType?: 'oneway' | 'roundtrip' = 'roundtrip';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(9)
  adults?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9)
  children?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9)
  infants?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9)
  seniors?: number = 0;

  @IsOptional()
  @IsEnum(CabinClass)
  cabinClass?: CabinClass;
}
