import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const mockProductId = '1';
const mockCategoryId = 'cat1';

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
  categoryIds: [mockCategoryId],
} as const;

const mockUpdateProductDto: UpdateProductDto = {
  name: 'Updated Smartphone',
  price: 899.99,
  categoryIds: [mockCategoryId],
} as const;

const mockPrismaService = {
  product: {
    findMany: jest.fn().mockResolvedValue(mockProducts),
    findUnique: jest.fn().mockResolvedValue(mockProduct),
    create: jest.fn().mockResolvedValue(mockProduct),
    update: jest
      .fn()
      .mockResolvedValue({ ...mockProduct, ...mockUpdateProductDto }),
    delete: jest.fn().mockResolvedValue(mockProduct),
  },
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const result = await service.create(mockCreateProductDto);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateProductDto.name,
          qty: mockCreateProductDto.qty,
          price: mockCreateProductDto.price,
          photo: mockCreateProductDto.photo,
          categories: {
            connect: mockCreateProductDto.categoryIds?.map((id) => ({ id })),
          },
        },
        include: {
          categories: true,
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should create a product without categories if categoryIds is not provided', async () => {
      const createDtoWithoutCategories = { ...mockCreateProductDto };
      delete createDtoWithoutCategories.categoryIds;

      await service.create(createDtoWithoutCategories);

      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: createDtoWithoutCategories.name,
          qty: createDtoWithoutCategories.qty,
          price: createDtoWithoutCategories.price,
          photo: createDtoWithoutCategories.photo,
        },
        include: {
          categories: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const result = await service.findAll();

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          categories: true,
        },
      });
      expect(result).toEqual(mockProducts);
    });

    it('should filter products by name', async () => {
      const name = 'Smartphone';
      await service.findAll(name);

      expect(mockPrismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: name },
        },
        include: {
          categories: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const result = await service.findOne(mockProductId);

      expect(mockPrismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: mockProductId },
        include: {
          categories: true,
        },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product is not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValueOnce(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const result = await service.update(mockProductId, mockUpdateProductDto);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: mockProductId },
        data: {
          name: mockUpdateProductDto.name,
          price: mockUpdateProductDto.price,
          categories: {
            set: mockUpdateProductDto.categoryIds?.map((id) => ({ id })),
          },
        },
        include: {
          categories: true,
        },
      });
      expect(result).toEqual({ ...mockProduct, ...mockUpdateProductDto });
    });

    it('should update a product without categories if categoryIds is not provided', async () => {
      const updateDtoWithoutCategories = {
        name: 'Updated Smartphone',
      };

      await service.update(mockProductId, updateDtoWithoutCategories);

      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: mockProductId },
        data: {
          name: updateDtoWithoutCategories.name,
        },
        include: {
          categories: true,
        },
      });
    });

    it('should throw NotFoundException if product to update is not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.update('non-existent-id', mockUpdateProductDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.product.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const result = await service.remove(mockProductId);

      expect(mockPrismaService.product.delete).toHaveBeenCalledWith({
        where: { id: mockProductId },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product to remove is not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValueOnce(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.product.delete).not.toHaveBeenCalled();
    });
  });
});
