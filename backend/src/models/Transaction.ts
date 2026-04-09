import prisma from '../database/db';
import { CreateTransactionDTO, UpdateTransactionDTO, TransactionFilters } from '../types';
import { Prisma } from '@prisma/client';

export class TransactionModel {
  static async create(userId: string, transactionData: CreateTransactionDTO) {
    return await prisma.transaction.create({
      data: {
        userId,
        type: transactionData.type,
        amount: new Prisma.Decimal(transactionData.amount),
        date: new Date(transactionData.date),
        description: transactionData.description,
        ...(transactionData.payment_method && { paymentMethod: transactionData.payment_method }),
        ...(transactionData.category_id && { categoryId: transactionData.category_id }),
      },
      include: {
        category: true,
      },
    });
  }

  static async findById(id: number) {
    return await prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  static async findByUserId(userId: string, filters?: TransactionFilters) {
    const where: any = { userId };

    if (filters) {
      if (filters.startDate) {
        where.date = { ...where.date, gte: new Date(filters.startDate) };
      }

      if (filters.endDate) {
        where.date = { ...where.date, lte: new Date(filters.endDate) };
      }

      if (filters.category_id !== undefined) {
        where.categoryId = filters.category_id;
      }

      if (filters.type) {
        where.type = filters.type;
      }
    }

    return await prisma.transaction.findMany({
      where,
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        category: true,
      },
    });
  }

  static async update(id: number, userId: string, transactionData: UpdateTransactionDTO) {
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== userId) {
      return null;
    }

    const data: any = {};

    if (transactionData.category_id !== undefined) {
      data.categoryId = transactionData.category_id;
    }

    if (transactionData.type !== undefined) {
      data.type = transactionData.type;
    }

    if (transactionData.amount !== undefined) {
      data.amount = new Prisma.Decimal(transactionData.amount);
    }

    if (transactionData.payment_method !== undefined) {
      data.paymentMethod = transactionData.payment_method;
    }

    if (transactionData.description !== undefined) {
      data.description = transactionData.description;
    }

    if (transactionData.date !== undefined) {
      data.date = new Date(transactionData.date);
    }

    return await prisma.transaction.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  static async delete(id: number, userId: string) {
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction || transaction.userId !== userId) {
      return false;
    }

    await prisma.transaction.delete({
      where: { id },
    });
    
    return true;
  }

  static async getBalance(userId: string) {
    const result = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: {
        amount: true,
      },
    });

    let income = 0;
    let expense = 0;

    result.forEach((item) => {
      const amount = item._sum.amount ? parseFloat(item._sum.amount.toString()) : 0;
      if (item.type === 'income') {
        income = amount;
      } else if (item.type === 'expense') {
        expense = amount;
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
    };
  }
}
