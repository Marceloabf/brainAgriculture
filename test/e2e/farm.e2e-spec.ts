import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/common/guards/roles.guard';
import { MockJwtAuthGuard } from '../mocks/jwt-auth.guard';
import { MockRolesGuard } from '../mocks/roles.guard';
import { createProducer } from './factories/producer.factory';
import { DataSource } from 'typeorm';
import { AppTestModule } from '../app-test.module';

describe('Farm (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let createdFarmId: string;
  let producerId: string;
  let dataSource: DataSource;

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

    server = app.getHttpServer();
    dataSource = moduleFixture.get(DataSource);

    const producer = createProducer();
    const result = await dataSource.getRepository('producer').save(producer);
    producerId = result.id;
  });

  it('/farms (POST) should create a farm', async () => {
    const response = await request(server)
      .post('/farms')
      .send({
        name: 'Fazenda E2E',
        city: 'E2ECity',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
        producerId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdFarmId = response.body.id;
  });

 it('/farms (GET) should return paginated farms with metadata', async () => {
  const response = await request(server)
    .get('/farms?page=1&limit=10') 
    .expect(200);

  const body = response.body;

  expect(body).toHaveProperty('data');
  expect(Array.isArray(body.data)).toBe(true);

  expect(body).toHaveProperty('meta');
  expect(body.meta).toMatchObject({
    currentPage: 1,
    itemsPerPage: 10,
  });

  expect(typeof body.meta.totalItems).toBe('number');
  expect(typeof body.meta.totalPages).toBe('number');
  expect(typeof body.meta.itemCount).toBe('number');
});


  it('/farms/:id (GET) should return a single farm', async () => {
    const response = await request(server).get(`/farms/${createdFarmId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdFarmId);
  });

  it('/farms/:id (PUT) should update a farm', async () => {
    const response = await request(server)
      .put(`/farms/${createdFarmId}`)
      .send({ name: 'Fazenda Atualizada' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Fazenda Atualizada');
  });

  it('/farms/:id (DELETE) should delete a farm', async () => {
    const response = await request(server).delete(`/farms/${createdFarmId}`);
    expect([200, 204]).toContain(response.status);
  });

  afterAll(async () => {
    await dataSource.getRepository('producer').delete({ id: producerId });
    await app.close();
  });
});
