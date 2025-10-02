import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { toNumber, trim } from 'src/utils/cast.util';

export class CommonQueryParam {
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  @IsOptional()
  public page = 1;

  @Transform(({ value }) => toNumber(value, { default: 10 }))
  @IsNumber()
  @IsOptional()
  public limit = 10;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public search?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public id?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public year?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public user_id?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public filter?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public active?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public role?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public status?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public date_from?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public date_to?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public sort_by?: string;

  @Transform(({ value }) => trim(value))
  @IsOptional()
  public type?: string;

  @Transform(({ value }) => (Array.isArray(value) ? value.map(trim) : [trim(value)]))
  @IsOptional()
  @IsString({ each: true })
  public tag?: string[];
}
