import { faker } from "@faker-js/faker/.";
import { Harvest } from "../../entities/harvest.entity";
import { createFarm } from "src/modules/farm/tests/factories/farm.factory";

export const createHarvest = (overrides?: Partial<Harvest>): Harvest => ({
  id: faker.string.uuid(),
  name: 'Safra Verão',
  farm: createFarm(),
  crops: [],
  ...overrides,
});
