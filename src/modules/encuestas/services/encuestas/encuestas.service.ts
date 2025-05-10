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

  async calcularResultados(id: number, codigo: string): Promise<any> {
    const encuesta = await this.encuestasRepository
      .createQueryBuilder('encuesta')
      .leftJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'preguntaOpcion')
      .leftJoinAndSelect('encuesta.respuestas', 'respuesta')
      .leftJoinAndSelect('respuesta.opciones', 'respuestaOpcion')
      .leftJoinAndSelect('respuestaOpcion.opcion', 'opcionRespuesta')
      .leftJoinAndSelect('opcionRespuesta.pregunta', 'preguntaDeOpcion')
      .leftJoinAndSelect('respuesta.abiertas', 'respuestaAbierta')
      .leftJoinAndSelect('respuestaAbierta.pregunta', 'preguntaAbierta')

      .where('encuesta.id = :id', { id })
      .andWhere('encuesta.codigoResultados = :codigo', { codigo })
      .orderBy('pregunta.numero', 'ASC') // Ordenar preguntas por su número
      .addOrderBy('preguntaOpcion.numero', 'ASC') // Ordenar opciones por su número
      .getOne();

    if (!encuesta) {
      throw new BadRequestException('Encuesta no encontrada o código inválido');
    }
    //console.log(JSON.stringify(encuesta.respuestas, null, 2)); muestra las respuestas que se han dado a la encuesta

    // Procesar las preguntas y sus respuestas
    const resultados = encuesta.preguntas.map((pregunta) => {
      const resultadoPregunta: any = {
        pregunta: pregunta.texto,
        opciones: {}, // Conteo de respuestas por opción
        respuestasAbiertas: [], // Respuestas abiertas asociadas a la pregunta
        totalRespuestas: 0, // Total de respuestas para esta pregunta
      };

      if (pregunta.tipo === 'ABIERTA') {
        encuesta.respuestas.forEach((respuesta) => {
          respuesta.abiertas
            ?.filter((abierta) => abierta.pregunta?.id === pregunta.id)
            .forEach((abierta) => {
              if (abierta.texto) {
                resultadoPregunta.respuestasAbiertas.push(abierta.texto);
                resultadoPregunta.totalRespuestas++;
              }
            });
        });
      } else {
        pregunta.opciones.forEach((opcion) => {
          resultadoPregunta.opciones[opcion.texto] = 0;
        });

        encuesta.respuestas.forEach((respuesta) => {
          respuesta.opciones.forEach((respuestaOpcion) => {
            if (
              respuestaOpcion.opcion &&
              respuestaOpcion.opcion.pregunta?.id === pregunta.id
            ) {
              const texto = respuestaOpcion.opcion.texto;
              resultadoPregunta.opciones[texto] =
                (resultadoPregunta.opciones[texto] || 0) + 1;
              resultadoPregunta.totalRespuestas++;
            }
          });
        });
      }

      // Si no hay respuestas, agregar un mensaje
      if (resultadoPregunta.totalRespuestas === 0) {
        resultadoPregunta.mensaje =
          'No se han recibido respuestas para esta pregunta.';
      }

      return resultadoPregunta;
    });

    return {
      encuesta: {
        id: encuesta.id,
        nombre: encuesta.nombre,
        codigoRespuesta: encuesta.codigoRespuesta,
      },
      resultados,
    };
  }
}
