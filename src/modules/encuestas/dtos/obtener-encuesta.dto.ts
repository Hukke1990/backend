import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ObtenerEncuestaDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  usuarioId: string;
}
