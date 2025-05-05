import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Pregunta } from './pregunta.entity';

@Entity({ name: 'opciones' })
export class Opcion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @Column()
  numero: number;

  @ManyToOne(() => Pregunta)
  @JoinColumn({ name: 'id_pregunta' })
  @Exclude()
  pregunta: Pregunta;
}
