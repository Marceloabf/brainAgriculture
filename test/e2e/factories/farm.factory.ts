import { faker } from '@faker-js/faker';
import { cpf } from 'cpf-cnpj-validator';
import { Farm } from 'src/modules/farm/entities/farm.entity';
import { Producer } from 'src/modules/producer/entities/producer.entity';

export function createProducer(override?: Partial<Producer>): Producer {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    document: cpf.generate(),
    farms: [],
    ...override,
  };
}

export function createFarm(override?: Partial<Farm>): Farm {
  const agriculturalArea = faker.number.int({ min: 50, max: 150 });
  const vegetationArea = faker.number.int({ min: 10, max: 50 });
  const totalArea = agriculturalArea + vegetationArea + faker.number.int({ min: 0, max: 50 });

  return {
    id: faker.string.uuid(),
    name: faker.location.street(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    totalArea,
    agriculturalArea,
    vegetationArea,
    producer: createProducer(),
    harvests: [],
    ...override,
  };
}
