import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';

export class AuthService {
  static async register(username: string, email: string, password: string) {
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
}