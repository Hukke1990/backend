import {
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class RespuestaAbiertaDto {
  @IsInt()
  id_pregunta: number;

  @IsString()
  texto: string;
}

class RespuestaOpcionDto {
  @IsInt()
  id_opcion: number;
}

export class CreateRespuestaDto {
  @IsString()
  codigo_respuesta: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaAbiertaDto)
  respuestas_abiertas?: RespuestaAbiertaDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaOpcionDto)
  respuestas_opciones?: RespuestaOpcionDto[];
}
