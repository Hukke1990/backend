import { Entity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Pregunta } from './pregunta.entity';
import { Exclude } from 'class-transformer';
import { Respuesta } from '../respuesta/respuesta.entity';

@Entity({ name: 'encuestas' })
export class Encuesta {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.encuesta, {
    cascade: ['insert'],
  })
  preguntas: Pregunta[];

  @Column({ name: 'codigo_RESPUESTA' })
  codigoRespuesta: string;

  @Column({ name: 'codigo_resultados' })
  @Exclude()
  codigoResultados: string;

  @OneToMany(() => Respuesta, (respuesta) => respuesta.encuesta)
  respuestas: Respuesta[];
}
