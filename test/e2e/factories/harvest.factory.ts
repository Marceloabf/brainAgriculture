import { faker } from "@faker-js/faker/.";
import { createFarm } from "../factories/farm.factory";
import { Harvest } from "src/modules/harvest/entities/harvest.entity";

export const createHarvest = (overrides?: Partial<Harvest>): Harvest => ({
  id: faker.string.uuid(),
  name: 'Safra Verão',
  farm: createFarm(),
  crops: [],
  ...overrides,
});
