import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';
import { RolesGuard } from '../../src/common/guards/roles.guard';
import { MockJwtAuthGuard } from '../mocks/jwt-auth.guard';
import { MockRolesGuard } from '../mocks/roles.guard';
import { faker } from '@faker-js/faker';
import { AppTestModule } from '../app-test.module';
import { cpf } from 'cpf-cnpj-validator';

describe('Producer (e2e)', () => {
  let app: INestApplication;
  let createdProducerId: string;

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

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    await app.init();
  });


  it('/producers (POST) - should create a producer', async () => {
    const createDto = {
      name: faker.person.fullName(),
      document: cpf.generate(),
    };

    const response = await request(app.getHttpServer())
      .post('/producers')
      .send(createDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(createDto.name);
    expect(response.body.document).toBe(createDto.document);

    createdProducerId = response.body.id;
  });

 
  it('/producers (GET) - should return array of producers', async () => {
    const response = await request(app.getHttpServer())
      .get('/producers')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  
  it('/producers/:id (GET) - should return a producer by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/producers/${createdProducerId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdProducerId);
  });

  it('/producers/:id (PUT) - should update a producer', async () => {
    const updateDto = {
      name: 'Nome Atualizado ' + faker.person.fullName(),
    };

    const response = await request(app.getHttpServer())
      .put(`/producers/${createdProducerId}`)
      .send(updateDto)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdProducerId);
    expect(response.body.name).toBe(updateDto.name);
  });

  it('/producers/:id (DELETE) - should delete a producer', async () => {
    await request(app.getHttpServer())
      .delete(`/producers/${createdProducerId}`)
      .expect(204); 
  });

  afterAll(async () => {
    await app.close();
  });
});
