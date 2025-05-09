import { Injectable } from '@nestjs/common';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encuesta } from '../../entitites/encuestas.entity';
import { CreateEncuestaDto } from '../../dtos/create-encuesta.dto';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { v4 } from 'uuid';

@Injectable()
export class EncuestasService {
  constructor(
    @InjectRepository(Encuesta)
    private encuestasRepository: Repository<Encuesta>,
  ) {}

  async crearEncuesta(dto: CreateEncuestaDto): Promise<{
    id: number;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    const encuesta: Encuesta = this.encuestasRepository.create({
      ...dto,
      codigoRespuesta: v4(),
      codigoResultados: v4(),
    });

    const encuestaGuardada = await this.encuestasRepository.save(encuesta);
    return {
      id: encuestaGuardada.id,
      codigoRespuesta: encuestaGuardada.codigoRespuesta,
      codigoResultados: encuestaGuardada.codigoResultados,
    };
  }

  async obtenerEncuesta(
    id: number,
    codigo: string,
    codigoTipo: CodigoTipoEnum.RESPUESTA | CodigoTipoEnum.RESULTADOS,
  ): Promise<Encuesta> {
    const query = this.encuestasRepository
      .createQueryBuilder('encuesta')
      .innerJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'preguntaOpcion')
      .where('encuesta.id = :id', { id });

    switch (codigoTipo) {
      case CodigoTipoEnum.RESPUESTA:
        query.andWhere('encuesta.codigoRespuesta = :codigo', { codigo });
        break;

      case CodigoTipoEnum.RESULTADOS:
        query.andWhere('encuesta.codigoResultados = :codigo', { codigo });
        break;
    }

    //ordenar preguntas con sus opciones
    query.orderBy('pregunta.numero', 'ASC');
    query.addOrderBy('preguntaOpcion.numero', 'ASC');

    const encuesta = await query.getOne();

    if (!encuesta) {
      throw new BadRequestException('Datos de encuesta no válidos');
    }

    return encuesta;
  }

  async obtenerEncuestaConPreguntas(id: number): Promise<any> {
    const encuesta = await this.encuestasRepository.findOne({
      where: { id },
      relations: ['preguntas', 'preguntas.opciones'],
    });

    if (!encuesta) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    return encuesta;
  }

  async obtenerResultadosPorCodigo(codigo: string): Promise<Encuesta> {
    const encuesta = await this.encuestasRepository.findOne({
      where: { codigoResultados: codigo },
      relations: [
        'preguntas',
        'preguntas.opciones',
        'respuestas',
        'respuestas.abiertas',
        'respuestas.abiertas.pregunta',
        'respuestas.opciones',
        'respuestas.opciones.opcion',
      ],
    });

    if (!encuesta) {
      throw new NotFoundException(
        'Encuesta no encontrada con ese código de resultados',
      );
    }

    return encuesta;
  }
}
