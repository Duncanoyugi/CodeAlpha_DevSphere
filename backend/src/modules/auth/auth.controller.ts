import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      
      const user = await AuthService.register(username, email, password);
      const { accessToken, refreshToken } = AuthService.generateTokens(user.id);
      
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      const user = await AuthService.login(email, password);
      const { accessToken, refreshToken } = AuthService.generateTokens(user.id);
      
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
  
  static async logout(req: Request, res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  }
  
  static async getMe(req: Request, res: Response) {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      const user = await AuthService.getUserById(decoded.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}