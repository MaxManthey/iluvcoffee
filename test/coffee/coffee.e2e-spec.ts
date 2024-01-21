import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from 'src/coffees/dto/update-coffee.dto';

describe('Feautre Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: [],
  };
  const expectedPartialCoffee = expect.objectContaining({
    ...coffee,
    flavors: expect.arrayContaining(
      coffee.flavors.map((name) => expect.objectContaining({ name })),
    ),
  });
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'user',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
  });
  it('GetAll [GET /]', () => {
    return request(app.getHttpServer())
      .get('/coffees')
      .then(({ body }) => {
        expectedPartialCoffee.id = body[0].id;
        expect(HttpStatus.OK);
        expect(body.length).toBeGreaterThan(0);
        expect(body[0]).toEqual(expectedPartialCoffee);
      });
  });
  it('GetOne [GET /:id]', () => {
    return request(app.getHttpServer())
      .get('/coffees/1')
      .then(({ body }) => {
        expectedPartialCoffee.id = body.id;
        expect(HttpStatus.OK);
        expect(body).toBeDefined();
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('UpdateOne [PATCH /:id]', () => {
    const updateCoffee = {
      name: 'Brand new Coffee',
    };
    return request(app.getHttpServer())
      .patch('/coffees/1')
      .send(updateCoffee as UpdateCoffeeDto)
      .then(({ body }) => {
        expect(HttpStatus.OK);
        expect(body).toBeDefined();
        expect(body.name).toEqual(updateCoffee.name);
      });
  });
  it('DeleteOne [DELETE /]', () => {
    return request(app.getHttpServer())
      .delete('/coffees/1')
      .then(({ body }) => {
        expect(HttpStatus.OK);
        expect(body).toBeDefined();
      })
      .then(() => {
        return request(app.getHttpServer())
          .get('/coffees/1')
          .expect(HttpStatus.NOT_FOUND);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
