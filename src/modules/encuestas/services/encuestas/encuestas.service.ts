import { Injectable } from '@nestjs/common';
import { CodigoTipoEnum } from '../../enums/codigo-tipo.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encuesta } from '../../entitites/encuestas.entity';
import { CreateEncuestaDto } from '../../dtos/create-encuesta.dto';
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
    codigoTipo: CodigoTipoEnum.REPUESTA | CodigoTipoEnum.RESULTADOS,
  ): Promise<Encuesta> {
    const query = this.encuestasRepository
      .createQueryBuilder('encuesta')
      .innerJoinAndSelect('encuesta.preguntas', 'pregunta')
      .innerJoinAndSelect('pregunta.opciones', 'preguntaOpcion')
      .where('encuesta.id = :id', { id });

    if (codigoTipo === CodigoTipoEnum.REPUESTA) {
      query.andWhere('encuesta.codigoRespuesta = :codigo', { codigo });
    } else if (codigoTipo === CodigoTipoEnum.RESULTADOS) {
      query.andWhere('encuesta.codigoResultados = :codigo', { codigo });
    }

    const encuesta = await query.getOne();
    if (!encuesta) {
      throw new Error('Encuesta no encontrada');
    }

    return encuesta;
  }
}
