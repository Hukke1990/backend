import { Module } from '@nestjs/common';
import { EncuestasController } from './controllers/encuestas.controllers';
import { EncuestasService } from './services/encuestas/encuestas.service';

@Module({
  imports: [],
  controllers: [EncuestasController],
  providers: [EncuestasService],
})
export class EncuestasModule {}
