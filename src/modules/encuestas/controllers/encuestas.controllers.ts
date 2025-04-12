import { Controller, Get, Post } from '@nestjs/common';
import { get } from 'http';
import { EncuestasService } from '../services/encuestas/encuestas.service';

@Controller('/encuestas')
export class EncuestasController {
  constructor(private encuestasService: EncuestasService) {}

  @Get(':id')
  async getEncuestas(): Promise<void> {}

  @Post('')
  async crearEncuesta(): Promise<void> {}
}
