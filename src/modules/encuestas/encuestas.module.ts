import { Module } from '@nestjs/common';
import { EncuestasController } from './controllers/encuestas.controllers';
import { EncuestasService } from './services/encuestas/encuestas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Encuesta } from './entitites/encuestas.entity';
import { Pregunta } from './entitites/pregunta.entity';
import { Opcion } from './entitites/opcion.entity';
import { Respuesta } from './respuesta/respuesta.entity';
import { RespuestaAbierta } from './respuesta-abierta/respuesta-abierta.entity';
import { RespuestaOpcion } from './respuesta-opcion/respuesta-opcion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Encuesta,
      Pregunta,
      Opcion,
      Respuesta,
      RespuestaAbierta,
      RespuestaOpcion,
    ]),
  ],
  controllers: [EncuestasController],
  providers: [EncuestasService],
})
export class EncuestasModule {}
