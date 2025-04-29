import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

const mockCategories = [
  {
    id: '1',
    name: 'Electronics',
    parentCategory: null,
    childCategories: [],
  },
];

const mockCategoryService = {
  findAll: jest.fn().mockResolvedValue(mockCategories),
};

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [{ provide: CategoryService, useValue: mockCategoryService }],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /category', () => {
    it('should return all categories', async () => {
      const result = await controller.findAll();
      expect(mockCategoryService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });
  });
});
