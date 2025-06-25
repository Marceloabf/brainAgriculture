import { faker } from "@faker-js/faker/.";

export const createProducer = () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    document: faker.string.numeric(11),
    farms: [
      {
        id: faker.string.uuid(),
        name: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        totalArea: faker.number.int({ min: 50, max: 200 }),
        agriculturalArea: faker.number.int({ min: 20, max: 100 }),
        vegetationArea: faker.number.int({ min: 10, max: 100 }),
        producer: {},
        harvests: [],
      },
    ],
  });