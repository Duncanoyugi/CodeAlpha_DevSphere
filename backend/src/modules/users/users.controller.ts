import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { AuthRequest } from '../../middleware/auth';

export class UsersController {
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.id || req.userId;
      const profile = await UsersService.getProfile(userId!);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
  
  static async getProfileByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const profile = await UsersService.getProfileByUsername(username);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
  
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await UsersService.updateProfile(req.userId!, req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async addSkill(req: AuthRequest, res: Response) {
    try {
      const { skill, level } = req.body;
      const newSkill = await UsersService.addSkill(req.userId!, skill, level);
      res.status(201).json(newSkill);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async updateSkill(req: AuthRequest, res: Response) {
    try {
      const { skillId } = req.params;
      const { level } = req.body;
      const updated = await UsersService.updateSkill(req.userId!, skillId, level);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async removeSkill(req: AuthRequest, res: Response) {
    try {
      const { skillId } = req.params;
      await UsersService.removeSkill(req.userId!, skillId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async searchUsers(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Search query required' });
      }
      const users = await UsersService.searchUsers(q);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}