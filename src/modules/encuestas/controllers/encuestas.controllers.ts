import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { EncuestasService } from '../services/encuestas/encuestas.service';
import { CreateEncuestaDto } from '../dtos/create-encuesta.dto';
import { ObtenerEncuestaDto } from '../dtos/obtener-encuesta.dto';
import { Encuesta } from '../entitites/encuestas.entity';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';

@Controller('/encuestas')
export class EncuestasController {
  constructor(private encuestasService: EncuestasService) {}

  @Post()
  async crearEncuesta(@Body() dto: CreateEncuestaDto): Promise<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    return await this.encuestasService.crearEncuesta(dto);
  }

  @Get(':id')
  async obtenerEncuesta(
    @Param('id') id: number,
    @Query() dto: ObtenerEncuestaDto,
  ): Promise<Encuesta> {
    return await this.encuestasService.obtenerEncuesta(
      id,
      dto.codigo,
      dto.tipo,
    );
  }

  //Para el participante
  @Get(':id/preguntas')
  async obtenerEncuestaConPreguntas(@Param('id') id: number): Promise<any> {
    return await this.encuestasService.obtenerEncuestaConPreguntas(id);
  }

  @Get('resultados/:id')
  async verResultadosPorIdYCodigo(
    @Param('id') id: number,
    @Query() dto: ObtenerEncuestaDto,
  ): Promise<Encuesta> {
    if (dto.tipo !== CodigoTipoEnum.RESULTADOS) {
      throw new BadRequestException(
        'Tipo debe ser RESULTADO para ver resultados',
      );
    }

    return this.encuestasService.obtenerEncuesta(id, dto.codigo, dto.tipo);
  }
}
