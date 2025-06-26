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

describe('Crop (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let createdCropId: string;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('/crops (POST) should create a crop', async () => {
    const cropDto = {
      name: faker.word.words(2),
    };

    const response = await request(server).post('/crops').send(cropDto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(cropDto.name);

    createdCropId = response.body.id;
  });

  it('/crops (GET) should list crops', async () => {
    const response = await request(server).get('/crops');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/crops/:id (GET) should return a single crop', async () => {
    const response = await request(server).get(`/crops/${createdCropId}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdCropId);
  });

  it('/crops/:id (PUT) should update a crop', async () => {
    const updateDto = {
      name: 'Updated Crop Name',
    };

    const response = await request(server)
      .put(`/crops/${createdCropId}`)
      .send(updateDto);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updateDto.name);
  });

  it('/crops/:id (DELETE) should delete a crop', async () => {
    const response = await request(server).delete(`/crops/${createdCropId}`);
    expect([200, 204]).toContain(response.status);
  });

  it('/crops/:id (GET) should return 404 for deleted crop', async () => {
    const response = await request(server).get(`/crops/${createdCropId}`);
    expect(response.status).toBe(404);
  });
});
