import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Respuesta } from '../respuesta/respuesta.entity';
import { RespuestaAbierta } from '../respuesta-abierta/respuesta-abierta.entity';
import { RespuestaOpcion } from '../respuesta-opcion/respuesta-opcion.entity';
import { Encuesta } from '../entitites/encuestas.entity';
import { CreateRespuestaDto } from '../dtos/create-respuesta.dto';

@Injectable()
export class RespuestasService {
  constructor(
    @InjectRepository(Respuesta)
    private readonly respuestaRepo: Repository<Respuesta>,
    @InjectRepository(RespuestaAbierta)
    private readonly abiertaRepo: Repository<RespuestaAbierta>,
    @InjectRepository(RespuestaOpcion)
    private readonly opcionRepo: Repository<RespuestaOpcion>,
    @InjectRepository(Encuesta)
    private readonly encuestaRepo: Repository<Encuesta>,
  ) {}

  async responder(dto: CreateRespuestaDto) {
    const encuesta = await this.encuestaRepo.findOne({
      where: { codigoRespuesta: dto.codigo_respuesta },
    });

    if (!encuesta) throw new NotFoundException('Encuesta no encontrada');

    const respuesta = this.respuestaRepo.create({ encuesta });
    await this.respuestaRepo.save(respuesta);

    if (dto.respuestas_abiertas) {
      for (const a of dto.respuestas_abiertas) {
        await this.abiertaRepo.save({
          texto: a.texto,
          pregunta: { id: a.id_pregunta },
          respuesta,
        });
      }
    }

    if (dto.respuestas_opciones) {
      for (const o of dto.respuestas_opciones) {
        await this.opcionRepo.save({
          opcion: { id: o.id_opcion },
          respuesta,
        });
      }
    }

    return { mensaje: 'Respuesta registrada correctamente' };
  }
}
