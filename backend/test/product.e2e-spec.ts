import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as http from 'http';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { seed } from '../prisma/seed';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await seed();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/POST product', () => {
    it('should create a product with categories', async () => {
      const categories = await prisma.category.findMany();
      const categoryIds = categories.map((c) => c.id);

      const response = await request(app.getHttpServer() as http.Server)
        .post('/product')
        .send({
          name: 'Laptop',
          price: 1500,
          qty: 10,
          photo: 'laptop.jpg',
          categoryIds: categoryIds.slice(0, 2),
        })
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(String),
        name: 'Laptop',
        price: 1500,
        qty: 10,
        photo: 'laptop.jpg',
        categories: expect.arrayContaining([
          expect.objectContaining({ id: categoryIds[0] }),
          expect.objectContaining({ id: categoryIds[1] }),
        ]),
      });
    });
  });

  describe('/GET products', () => {
    it('should filter products by name', async () => {
      const category = await prisma.category.findFirst();

      await prisma.product.create({
        data: {
          name: 'Smartphone',
          price: 800,
          qty: 5,
          photo: 'smartphone.jpg',
          categories: {
            connect: [{ id: category!.id }],
          },
        },
      });

      const response = await request(app.getHttpServer() as http.Server)
        .get('/product?name=Smart')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Smartphone',
            qty: 5,
            photo: 'smartphone.jpg',
          }),
        ]),
      );
    });
  });

  describe('/GET :id', () => {
    it('should return 404 for non-existent product', async () => {
      await request(app.getHttpServer() as http.Server)
        .get('/product/non-existent-id')
        .expect(404);
    });
  });
});

describe('CategoryController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET categories (full structure)', async () => {
    const response = await request(app.getHttpServer() as http.Server)
      .get('/category')
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Electronics',
          parentCategory: null,
          childCategories: expect.arrayContaining([
            expect.objectContaining({ name: 'Computers' }),
            expect.objectContaining({ name: 'Smartphones' }),
          ]),
        }),
      ]),
    );
  });
});
