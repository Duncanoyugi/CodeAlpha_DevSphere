import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  
  if (err.code === 'P2002') {
    return res.status(400).json({ message: 'Duplicate field value' });
  }
  
  res.status(500).json({ message: 'Something went wrong' });
};