import { Transaction, Prisma } from '../../generated/client';
import { prisma } from '../client';

export class TransactionService {
  static async createTransaction(data: Prisma.TransactionCreateInput): Promise<Transaction> {
    return prisma.transaction.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        fromAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
          },
        },
        toAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
          },
        },
      },
    });
  }

  static async findTransactionById(id: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        fromAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
          },
        },
        toAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
          },
        },
      },
    });
  }

  static async findTransactionsByUserId(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { userId },
      include: {
        fromAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
          },
        },
        toAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }

  static async findTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: {
        OR: [
          { fromAccountId: accountId },
          { toAccountId: accountId },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        fromAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
          },
        },
        toAccount: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async updateTransactionStatus(
    id: string,
    status: Prisma.TransactionUpdateInput['status']
  ): Promise<Transaction> {
    return prisma.transaction.update({
      where: { id },
      data: { status },
    });
  }
}
