import { User, UserProfile, Prisma } from '../../generated/client';
import { prisma } from '../client';

export class UserService {
  static async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
      include: {
        profile: true,
        accounts: true,
      },
    });
  }

  static async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        accounts: true,
      },
    });
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        accounts: true,
      },
    });
  }

  static async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        profile: true,
        accounts: true,
      },
    });
  }

  static async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  static async createUserProfile(data: Prisma.UserProfileCreateInput): Promise<UserProfile> {
    return prisma.userProfile.create({
      data,
    });
  }

  static async updateUserProfile(userId: string, data: Prisma.UserProfileUpdateInput): Promise<UserProfile> {
    return prisma.userProfile.update({
      where: { userId },
      data,
    });
  }
}
