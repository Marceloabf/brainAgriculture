import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Farm } from 'src/modules/farm/entities/farm.entity';
import { Crop } from 'src/modules/crop/entities/crop.entity';

@Entity()
export class Harvest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; 

  @ManyToOne(() => Farm, (farm) => farm.harvests)
  farm: Farm;

  @ManyToMany(() => Crop, (crop) => crop.harvest)
  @JoinTable()
  crops: Crop[];
}
