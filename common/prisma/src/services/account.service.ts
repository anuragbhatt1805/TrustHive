import { Account, Transaction, Prisma } from '../../generated/client';
import { prisma } from '../client';

export class AccountService {
  static async createAccount(data: Prisma.AccountCreateInput): Promise<Account> {
    return prisma.account.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        fromTransactions: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
        toTransactions: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  static async findAccountById(id: string): Promise<Account | null> {
    return prisma.account.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        fromTransactions: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
        toTransactions: {
          take: 10,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  static async findAccountsByUserId(userId: string): Promise<Account[]> {
    return prisma.account.findMany({
      where: { userId },
      include: {
        fromTransactions: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
        toTransactions: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  static async updateAccountBalance(id: string, balance: number): Promise<Account> {
    return prisma.account.update({
      where: { id },
      data: { balance },
    });
  }

  static async getAccountBalance(id: string): Promise<number> {
    const account = await prisma.account.findUnique({
      where: { id },
      select: { balance: true },
    });
    return account?.balance?.toNumber() || 0;
  }
}
