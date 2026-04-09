import prisma from '../database/db';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export class CategoryModel {
  static async create(userId: string, categoryData: CreateCategoryDTO) {
    return await prisma.category.create({
      data: {
        userId,
        name: categoryData.name,
      },
    });
  }

  static async findById(id: number) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        transactions: true,
      },
    });
  }

  static async findByUserId(userId: string) {
    return await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
      include: {
        transactions: true,
      },
    });
  }

  static async update(id: number, userId: string, categoryData: UpdateCategoryDTO) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.userId !== userId) {
      return null;
    }

    return await prisma.category.update({
      where: { id },
      data: {
        name: categoryData.name,
      },
    });
  }

  static async delete(id: number, userId: string) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.userId !== userId) {
      return false;
    }

    await prisma.category.delete({
      where: { id },
    });
    
    return true;
  }
}
