import { faker } from '@faker-js/faker';
import { Crop } from 'src/modules/crop/entities/crop.entity';


export function createCrop(overrides?: Partial<Crop>): Crop {
  const crop = new Crop();
  crop.id = faker.string.uuid();
  crop.name = faker.word.noun();

  return { ...crop, ...overrides };
}
