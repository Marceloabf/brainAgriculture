import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Harvest } from 'src/modules/harvest/entities/harvest.entity';

@Entity()
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; 

  @ManyToMany(() => Harvest, (harvest) => harvest.crops)
  harvest: Harvest[];
}
