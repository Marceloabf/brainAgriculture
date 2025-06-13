import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Producer } from 'src/modules/producer/entities/producer.entity';
import { Harvest } from 'src/modules/harvest/entities/harvest.entity';

@Entity()
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column('float')
  totalArea: number;

  @Column('float')
  agriculturalArea: number;

  @Column('float')
  vegetationArea: number;

  @ManyToOne(() => Producer, (producer) => producer.farms, { onDelete: 'CASCADE' })
  producer: Producer;

  @OneToMany(() => Harvest, (harvest) => harvest.farm, { cascade: true })
  harvests: Harvest[];
}
