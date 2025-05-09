import { Body, Controller, Post } from '@nestjs/common';
import { RespuestasService } from '../respuesta/respuesta.service';
import { CreateRespuestaDto } from '../dtos/create-respuesta.dto';

@Controller('respuestas')
export class RespuestasController {
  constructor(private readonly respuestasService: RespuestasService) {}

  @Post()
  async crear(@Body() dto: CreateRespuestaDto) {
    return this.respuestasService.responder(dto);
  }
}
