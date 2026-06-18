import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const postSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10).max(5000),
  tags: z.array(z.string()).max(5),
  imageUrl: z.string().optional(),
})

export const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string().optional(),
  parentId: z.string().optional(),
})


export const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  experience: z.string().optional(),
  avatar: z.string().url().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PostInput = z.infer<typeof postSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type ProfileInput = z.infer<typeof profileSchema>