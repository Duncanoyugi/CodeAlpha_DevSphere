export interface PostForScoring {
  id: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  createdAt: Date;
  authorId: string;
  authorReputation: number;
  tags: string[];
}

export class FeedRankingAlgorithm {
  private static readonly HOURS_WEIGHT = 0.5;
  private static readonly LIKES_WEIGHT = 1.0;
  private static readonly COMMENTS_WEIGHT = 1.5;
  private static readonly SHARES_WEIGHT = 2.0;
  private static readonly VIEWS_WEIGHT = 0.1;
  private static readonly REPUTATION_WEIGHT = 0.3;
  private static readonly RECENCY_DECAY_FACTOR = 0.05;
  
  static calculateHotnessScore(post: PostForScoring): number {
    const now = new Date();
    const hoursSincePost = (now.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60);
    
    // Engagement score
    const engagementScore = 
      (post.likes * this.LIKES_WEIGHT) +
      (post.comments * this.COMMENTS_WEIGHT) +
      (post.shares * this.SHARES_WEIGHT) +
      (post.views * this.VIEWS_WEIGHT);
    
    // Reputation boost
    const reputationBoost = (post.authorReputation / 1000) * this.REPUTATION_WEIGHT;
    
    // Time decay (Reddit-style logarithmic decay)
    const timeDecay = Math.pow(1 + this.RECENCY_DECAY_FACTOR, hoursSincePost);
    
    const hotness = (engagementScore + reputationBoost) / timeDecay;
    
    return Math.round(hotness * 100) / 100;
  }
  
  static calculateTrendingScore(post: PostForScoring): number {
    // Trending focuses on recent velocity
    const now = new Date();
    const hoursSincePost = (now.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60);
    
    // Velocity = engagement per hour
    const velocity = 
      (post.likes + post.comments * 2 + post.shares * 3) / Math.max(1, hoursSincePost);
    
    // Exponential decay for trending
    const trendingScore = velocity * Math.exp(-hoursSincePost / 24);
    
    return Math.round(trendingScore * 100) / 100;
  }
  
  static personalizeForUser(
    posts: PostForScoring[],
    userInterests: string[], // User's followed technologies
    userSkills: string[]     // User's declared skills
  ): PostForScoring[] {
    return posts.map(post => {
      let personalizationBonus = 0;
      
      // Bonus for posts with tags matching user interests
      const matchingTags = post.tags.filter(tag => 
        userInterests.includes(tag) || userSkills.includes(tag)
      );
      
      personalizationBonus += matchingTags.length * 0.5;
      
      // Bonus for posts from users with similar skills
      // This would require more data about the author
      
      const personalizedScore = this.calculateHotnessScore(post) + personalizationBonus;
      
      return { ...post, personalizedScore };
    }).sort((a, b) => (b.personalizedScore || 0) - (a.personalizedScore || 0));
  }
}