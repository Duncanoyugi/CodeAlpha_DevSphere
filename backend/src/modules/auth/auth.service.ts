import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';
import prisma from '../../config/database';

export class AuthService {
  private static validateRegistration(username: string, email: string, password: string) {
    if (!username || typeof username !== 'string') {
      throw new Error('Username is required');
    }

    if (!email || typeof email !== 'string') {
      throw new Error('Email is required');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  static async register(username: string, email: string, password: string) {
    this.validateRegistration(username, email, password);

    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email }, { username }]
        }
      });
      
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          username,
          email,
          passwordHash,
          bio: '',
          experience: 'Junior'
        }
      });
      
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new Error('User with this email or username already exists');
      }

      throw error;
    }
  }
  
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    
    return user;
  }
  
  static generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }
  
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        skills: true,
        followers: true,
        following: true
      }
    });
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return this.generateTokens(user.id);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}