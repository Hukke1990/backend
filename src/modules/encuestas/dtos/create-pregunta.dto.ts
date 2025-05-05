import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { CreateOpcionDto } from './create-opcion.dto';
import { TiposRespuestaEnum } from '../enums/tipos-respuesta.enum';

export class CreatePreguntaDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  numero: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  texto: string;

  @ApiProperty({ enum: TiposRespuestaEnum })
  @IsEnum(TiposRespuestaEnum)
  @IsNotEmpty()
  tipo: TiposRespuestaEnum;

  @ApiProperty({ type: [CreateOpcionDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionDto)
  opciones?: CreateOpcionDto[];
}
