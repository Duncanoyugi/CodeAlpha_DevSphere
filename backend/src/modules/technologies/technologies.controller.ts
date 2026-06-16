import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { TechnologiesService } from './technologies.service';

export class TechnologiesController {
  static async getAllTechnologies(req: AuthRequest, res: Response) {
    try {
      const technologies = await TechnologiesService.getAllTechnologies();
      res.json(technologies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getTechnologyPage(req: AuthRequest, res: Response) {
    try {
      const { technology } = req.params;
      const page = await TechnologiesService.getTechnologyPage(technology);
      res.json(page);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async followTechnology(req: AuthRequest, res: Response) {
    try {
      const { technology } = req.params;
      const follow = await TechnologiesService.followTechnology(req.userId!, technology);
      res.status(201).json(follow);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async unfollowTechnology(req: AuthRequest, res: Response) {
    try {
      const { technology } = req.params;
      await TechnologiesService.unfollowTechnology(req.userId!, technology);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async getFollowedTechnologies(req: AuthRequest, res: Response) {
    try {
      const technologies = await TechnologiesService.getFollowedTechnologies(req.userId!);
      res.json(technologies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getTrendingTechnologies(req: AuthRequest, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const trending = await TechnologiesService.getTrendingTechnologies(limit);
      res.json(trending);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}