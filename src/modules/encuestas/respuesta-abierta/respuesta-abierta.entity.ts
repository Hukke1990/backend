import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pregunta } from '../entitites/pregunta.entity';
import { Respuesta } from '../respuesta/respuesta.entity';

@Entity({ name: 'respuestas_abiertas' })
export class RespuestaAbierta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @ManyToOne(() => Pregunta)
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Pregunta;

  @ManyToOne(() => Respuesta, (respuesta) => respuesta.abiertas)
  @JoinColumn({ name: 'id_respuesta' })
  respuesta: Respuesta;
  idPregunta: number;
}
