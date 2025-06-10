import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Farm } from 'src/modules/farm/entities/farm.entity';

@Entity()
export class Producer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  document: string; 

  @Column()
  name: string;

  @OneToMany(() => Farm, (farm) => farm.producer, { cascade: true })
  farms: Farm[];
}
