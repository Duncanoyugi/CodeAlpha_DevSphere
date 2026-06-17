export const APP_NAME = 'DevSphere'
export const APP_DESCRIPTION = 'Developer Community Platform'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  PROFILE: '/profile',
  PROFILE_USER: '/profile/:username',
  POST: '/post/:id',
  CREATE_POST: '/create-post',
  TECHNOLOGY: '/technology/:name',
  SEARCH: '/search',
  SETTINGS: '/settings',
} as const

export const POST_TAGS = [
  'React', 'TypeScript', 'Node.js', 'PostgreSQL',
  'MongoDB', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'DevOps', 'Testing', 'Performance',
  'Security', 'Architecture', 'Frontend', 'Backend'
] as const

export const EXPERIENCE_LEVELS = [
  'Junior', 'Mid', 'Senior', 'Lead', 'Principal'
] as const

export const SKILL_LEVELS = [
  'Beginner', 'Intermediate', 'Advanced', 'Expert'
] as const