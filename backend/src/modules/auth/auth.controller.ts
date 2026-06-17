import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthService } from './auth.service';

export class AuthController {
  private static getAccessTokenCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 15 * 60 * 1000,
      path: '/',
    };
  }

  private static getRefreshTokenCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };
  }

  private static setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, AuthController.getAccessTokenCookieOptions());
    res.cookie('refreshToken', refreshToken, AuthController.getRefreshTokenCookieOptions());
  }

  private static clearAuthCookies(res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }

  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      const user = await AuthService.register(username, email, password);
      const { accessToken, refreshToken } = AuthService.generateTokens(user.id);

      AuthController.setAuthCookies(res, accessToken, refreshToken);

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
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

      AuthController.setAuthCookies(res, accessToken, refreshToken);


      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    AuthController.clearAuthCookies(res);

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

  static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
      }

      const tokens = await AuthService.refreshToken(refreshToken);

      AuthController.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);


      res.json({ accessToken: tokens.accessToken });
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  }
}

