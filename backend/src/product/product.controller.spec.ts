import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const mockProductId = '1';

const mockProduct = {
  id: mockProductId,
  name: 'Smartphone',
  qty: 10,
  price: 999.99,
  photo: 'smartphone.jpg',
  categories: [],
};

const mockProducts = [mockProduct];

const mockCreateProductDto: CreateProductDto = {
  name: 'Smartphone',
  qty: 10,
  price: 999.99,
  photo: 'smartphone.jpg',
  categoryIds: ['cat1'],
};

const mockUpdateProductDto: UpdateProductDto = {
  name: 'Updated Smartphone',
  price: 899.99,
};

const mockProductService = {
  create: jest.fn().mockResolvedValue(mockProduct),
  findAll: jest.fn().mockResolvedValue(mockProducts),
  findOne: jest.fn().mockResolvedValue(mockProduct),
  update: jest
    .fn()
    .mockResolvedValue({ ...mockProduct, ...mockUpdateProductDto }),
  remove: jest.fn().mockResolvedValue(mockProduct),
};

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const result = await controller.create(mockCreateProductDto);

      expect(mockProductService.create).toHaveBeenCalledWith(
        mockCreateProductDto,
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = await controller.findAll();

      expect(mockProductService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockProducts);
    });

    it('should return products filtered by name', async () => {
      const name = 'Smartphone';
      await controller.findAll(name);

      expect(mockProductService.findAll).toHaveBeenCalledWith(name);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const result = await controller.findOne(mockProductId);

      expect(mockProductService.findOne).toHaveBeenCalledWith(mockProductId);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const result = await controller.update(
        mockProductId,
        mockUpdateProductDto,
      );

      expect(mockProductService.update).toHaveBeenCalledWith(
        mockProductId,
        mockUpdateProductDto,
      );
      expect(result).toEqual({ ...mockProduct, ...mockUpdateProductDto });
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const result = await controller.remove(mockProductId);

      expect(mockProductService.remove).toHaveBeenCalledWith(mockProductId);
      expect(result).toEqual(mockProduct);
    });
  });
});
