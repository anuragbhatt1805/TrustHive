import { Prisma } from '../../generated/client';

export class Validators {
  /**
   * Validate user input for registration
   */
  static validateRegistrationInput(data: Prisma.UserCreateInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.email || !/.+@.+\..+/.test(data.email)) {
      errors.push('Invalid email address');
    }

    if (!data.password || data.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (errors.length) {
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  }

  /**
   * Validate user input for login
   */
  static validateLoginInput(email: string, password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!email || !/.+@.+\..+/.test(email)) {
      errors.push('Invalid email address');
    }

    if (!password) {
      errors.push('Password is required');
    }

    if (errors.length) {
      return { valid: false, errors };
    }

    return { valid: true, errors: [] };
  }

  /**
   * Validate account number formatting
   */
  static validateAccountNumber(accountNumber: string): boolean {
    return /^ACC\d{9}$/.test(accountNumber);
  }
}
