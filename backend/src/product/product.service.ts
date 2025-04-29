import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { categoryIds, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        ...(categoryIds && categoryIds.length > 0
          ? {
              categories: {
                connect: categoryIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        categories: true,
      },
    });
  }

  async findAll(name?: string) {
    const where = name ? { name: { contains: name } } : {};

    return this.prisma.product.findMany({
      where,
      include: {
        categories: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { categoryIds, ...productData } = updateProductDto;

    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(categoryIds
          ? {
              categories: {
                set: categoryIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: {
        categories: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
