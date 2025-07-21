// Main export file for @trusthive/prisma-config

// Export Prisma client
export * from '../generated/client';
export { default as prisma } from './client';

// Export services
export { UserService } from './services/user.service';
export { AccountService } from './services/account.service';
export { TransactionService } from './services/transaction.service';

// Export utilities
export * from './utils/database';
export * from './utils/validators';

// Re-export commonly used types for convenience
export type {
  User,
  UserProfile,
  Account,
  Transaction,
  Card,
  UserSession,
  Prisma,
  PrismaClient,
} from '../generated/client';
