import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespuestasController } from '../respuesta/respuesta.controller';
import { RespuestasService } from './respuesta.service';
import { Respuesta } from './respuesta.entity';
import { RespuestaAbierta } from '../respuesta-abierta/respuesta-abierta.entity';
import { RespuestaOpcion } from '../respuesta-opcion/respuesta-opcion.entity';
import { Encuesta } from '../entitites/encuestas.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Respuesta,
      RespuestaAbierta,
      RespuestaOpcion,
      Encuesta,
    ]),
  ],
  controllers: [RespuestasController],
  providers: [RespuestasService],
})
export class RespuestasModule {}
