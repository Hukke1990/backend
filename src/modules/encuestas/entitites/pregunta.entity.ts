import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Encuesta } from './encuestas.entity';
import { Opcion } from './opcion.entity';
import { Exclude } from 'class-transformer';
import { TiposRespuestaEnum } from '../enums/tipos-respuesta.enum';
import { JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'preguntas' })
export class Pregunta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero: number;

  @Column()
  texto: string;

  @Column({ type: 'enum', enum: TiposRespuestaEnum })
  tipo: TiposRespuestaEnum;

  @ManyToOne(() => Encuesta)
  @JoinColumn({ name: 'id_encuesta' })
  @Exclude()
  encuesta: Encuesta;

  @OneToMany(() => Opcion, (opcion) => opcion.pregunta, { cascade: ['insert'] })
  opciones: Opcion[];
}
