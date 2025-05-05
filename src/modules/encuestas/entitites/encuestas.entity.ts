import { Entity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Pregunta } from './pregunta.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'encuestas' })
export class Encuesta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @OneToMany(() => Pregunta, (pregunta) => pregunta.encuesta, {
    cascade: ['insert'],
  })
  preguntas: Pregunta[];

  @Column({ name: 'codigo_repuesta' })
  codigorepuesta: string;

  @Column({ name: 'codigo_resultados' })
  @Exclude()
  codigoresultados: string;
}
