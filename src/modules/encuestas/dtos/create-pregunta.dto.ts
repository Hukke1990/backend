import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TiposRespuestaEnum } from '../enums/tipos-respuesta.enum';

class CreateOpcionDto {
  @ApiProperty()
  @IsNumber()
  numero: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texto: string;
}

export class CreatePreguntaDto {
  @ApiProperty()
  @IsNumber()
  numero: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiProperty({ enum: TiposRespuestaEnum })
  @IsEnum(TiposRespuestaEnum)
  tipo: TiposRespuestaEnum;

  @ApiPropertyOptional({ type: [CreateOpcionDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionDto)
  opciones?: CreateOpcionDto[];
}
