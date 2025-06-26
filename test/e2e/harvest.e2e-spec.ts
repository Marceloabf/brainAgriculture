import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/common/guards/roles.guard';
import { MockJwtAuthGuard } from '../mocks/jwt-auth.guard';
import { MockRolesGuard } from '../mocks/roles.guard';
import { faker } from '@faker-js/faker';
import { AppTestModule } from '../app-test.module';
import { cpf } from 'cpf-cnpj-validator';
import { Harvest } from 'src/modules/harvest/entities/harvest.entity';

describe('Harvest (e2e)', () => {
  let app: INestApplication;
  let createdHarvestId: string;
  let farmId: string;
  let cropIds: string[];
let producerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppTestModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useClass(MockRolesGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

     const producerResponse = await request(app.getHttpServer())
    .post('/producers')
    .send({
      name: faker.person.fullName(),
      document: cpf.generate(),
      farms: [],
    })
    .expect(201);
    producerId = producerResponse.body.id;

    const farmResponse = await request(app.getHttpServer())
      .post('/farms')
      .send({
        name: faker.company.name(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        producerId: producerId,
        totalArea: 100,
        agriculturalArea: 70,
        vegetationArea: 30,
      })
      .expect(201);
      farmId = farmResponse.body.id;

    const cropResponse1 = await request(app.getHttpServer())
      .post('/crops')
      .send({ name: 'Soja' })
      .expect(201);

    const cropResponse2 = await request(app.getHttpServer())
      .post('/crops')
      .send({ name: 'Milho' })
      .expect(201);

    cropIds = [cropResponse1.body.id, cropResponse2.body.id];
  });

  it('/harvests (POST) should create a harvest', async () => {
    const createDto = {
      name: faker.company.name(),
      farmId: farmId,
      crops: cropIds,
    };

    const response = await request(app.getHttpServer())
      .post('/harvests')
      .send(createDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(createDto.name);
    createdHarvestId = response.body.id;
  });

  it('/harvests (GET) should return an array of harvests', async () => {
    const response = await request(app.getHttpServer())
      .get('/harvests')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/harvests/:id (GET) should return a harvest by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/harvests/${createdHarvestId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdHarvestId);
  });

  it('/harvests/:id (PUT) should update a harvest', async () => {
    const updateDto = {
      name: 'Updated Harvest Name',
    };

    const response = await request(app.getHttpServer())
      .put(`/harvests/${createdHarvestId}`)
      .send(updateDto)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdHarvestId);
    expect(response.body.name).toBe(updateDto.name);
  });

  it('/harvests/:id (DELETE) should delete a harvest', async () => {
    await request(app.getHttpServer())
      .delete(`/harvests/${createdHarvestId}`)
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
