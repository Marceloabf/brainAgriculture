import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Harvest } from 'src/modules/harvest/entities/harvest.entity';

@Entity()
export class Crop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; 

  @ManyToOne(() => Harvest, (harvest) => harvest.crops)
  harvest: Harvest;
}
