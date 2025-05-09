import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Encuesta } from '../entitites/encuestas.entity';
import { RespuestaAbierta } from '../respuesta-abierta/respuesta-abierta.entity';
import { RespuestaOpcion } from '../respuesta-opcion/respuesta-opcion.entity';

@Entity({ name: 'respuestas' })
export class Respuesta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Encuesta, (encuesta) => encuesta.respuestas)
  @JoinColumn({ name: 'id_encuesta' })
  encuesta: Encuesta;

  @OneToMany(() => RespuestaAbierta, (abierta) => abierta.respuesta, {
    cascade: true,
  })
  abiertas: RespuestaAbierta[];

  @OneToMany(() => RespuestaOpcion, (opcion) => opcion.respuesta, {
    cascade: true,
  })
  opciones: RespuestaOpcion[];
}
