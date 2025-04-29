import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';

const mockCategories = [
  {
    id: '1',
    name: 'Electronics',
    parentCategory: null,
    childCategories: [],
  },
];

const mockPrismaService = {
  category: {
    findMany: jest.fn().mockResolvedValue(mockCategories),
  },
};

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = await service.findAll();
      expect(mockPrismaService.category.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });
  });
});
