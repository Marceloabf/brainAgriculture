import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => Crop, (crop) => crop.harvest, { cascade: true })
  crops: Crop[];
}
