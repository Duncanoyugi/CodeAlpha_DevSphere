import { Request, Response } from 'express';
import { PostsService } from './posts.service';
import { AuthRequest } from '../../middleware/auth';

export class PostsController {
  static async createPost(req: AuthRequest, res: Response) {
    try {
      const post = await PostsService.createPost(req.userId!, req.body);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async getPost(
    req: AuthRequest & Request<{ id: string }>,
    res: Response
  ) {
    try {
      const post = await PostsService.getPost(req.params.id);
      res.json(post);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }
  
  static async updatePost(req: AuthRequest, res: Response) {
    try {
      const post = await PostsService.updatePost(req.params.id, req.userId!, req.body);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async deletePost(req: AuthRequest, res: Response) {
    try {
      await PostsService.deletePost(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  
  static async getUserPosts(
    req: AuthRequest & Request<{ userId: string }>,
    res: Response
  ) {
    try {
      const posts = await PostsService.getUserPosts(req.params.userId);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
  
  static async getPostsByTag(
    req: AuthRequest & Request<{ tag: string }>,
    res: Response
  ) {
    try {
      const { tag } = req.params;
      const posts = await PostsService.getPostsByTag(tag);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}