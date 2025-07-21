import { prisma } from '../client';

export class DatabaseUtils {
  /**
   * Test database connection
   */
  static async testConnection(): Promise<boolean> {
    try {
      await prisma.$connect();
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  /**
   * Execute database migration
   */
  static async migrate(): Promise<void> {
    try {
      // This would typically be handled by Prisma CLI
      console.log('Database migration should be handled by Prisma CLI');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  /**
   * Generate unique account number
   */
  static generateAccountNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ACC${timestamp.slice(-6)}${random}`;
  }

  /**
   * Generate unique transaction reference
   */
  static generateTransactionReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TXN${timestamp}${random}`;
  }

  /**
   * Health check for database
   */
  static async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    latency: number;
  }> {
    const startTime = Date.now();
    
    try {
      await prisma.$queryRaw`SELECT 1`;
      const endTime = Date.now();
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        latency: endTime - startTime,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        latency: Date.now() - startTime,
      };
    }
  }
}
