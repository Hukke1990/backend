import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Respuesta } from '../respuesta/respuesta.entity';
import { Opcion } from '../entitites/opcion.entity';

@Entity({ name: 'respuestas_opciones' })
export class RespuestaOpcion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Respuesta, (respuesta) => respuesta.opciones)
  @JoinColumn({ name: 'id_respuesta' })
  respuesta: Respuesta;

  @ManyToOne(() => Opcion)
  @JoinColumn({ name: 'id_opcion' })
  opcion: Opcion;
}
