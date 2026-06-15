import { Request, Response } from 'express';
import { FollowsService } from './follows.service';
import { AuthRequest } from '../../middleware/auth';

export class FollowsController {
  static async followUser(
    req: AuthRequest & Request<{ userId: string }>,
    res: Response
  ) {
    try {
      const follow = await FollowsService.followUser(req.userId!, req.params.userId);
      res.status(201).json(follow);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async unfollowUser(
    req: AuthRequest & Request<{ userId: string }>,
    res: Response
  ) {
    try {
      await FollowsService.unfollowUser(req.userId!, req.params.userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async getFollowers(
    req: AuthRequest & Request<{ userId: string }>,
    res: Response
  ) {
    try {
      const followers = await FollowsService.getFollowers(req.params.userId);
      res.json(followers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getFollowing(
    req: AuthRequest & Request<{ userId: string }>,
    res: Response
  ) {
    try {
      const following = await FollowsService.getFollowing(req.params.userId);
      res.json(following);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async isFollowing(
    req: AuthRequest & Request<{ userId: string }>,
    res: Response
  ) {
    try {
      const isFollowing = await FollowsService.isFollowing(req.userId!, req.params.userId);
      res.json({ isFollowing });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getFollowCounts(
    req: AuthRequest & Request<{ userId: string }>,
    res: Response
  ) {
    try {
      const counts = await FollowsService.getFollowCounts(req.params.userId);
      res.json(counts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}