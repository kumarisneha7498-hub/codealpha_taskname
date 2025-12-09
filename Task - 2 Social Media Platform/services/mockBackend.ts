import { User, Post, Comment } from '../types';

// --- Mock Data ---

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'tech_guru',
    name: 'Alex Rivera',
    bio: 'Building the future one line of code at a time. 🚀',
    avatarUrl: 'https://picsum.photos/seed/u1/200/200',
    followers: ['u2', 'u3'],
    following: ['u2'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u2',
    username: 'travel_lens',
    name: 'Sarah Chen',
    bio: 'Wanderlust | Photography | Coffee ☕️',
    avatarUrl: 'https://picsum.photos/seed/u2/200/200',
    followers: ['u1'],
    following: ['u1', 'u3'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'u3',
    username: 'design_daily',
    name: 'Marcus Johnson',
    bio: 'UI/UX Designer. Minimalist.',
    avatarUrl: 'https://picsum.photos/seed/u3/200/200',
    followers: ['u2'],
    following: ['u1'],
    createdAt: new Date().toISOString(),
  }
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    content: 'Just deployed my first React Native app! The journey was tough but worth it. #coding #reactnative',
    imageUrl: 'https://picsum.photos/seed/p1/800/600',
    likes: ['u2', 'u3'],
    comments: [
      { id: 'c1', postId: 'p1', userId: 'u2', text: 'Congrats Alex! Looks amazing.', createdAt: new Date(Date.now() - 3600000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'p2',
    userId: 'u2',
    content: 'Sunset in Kyoto. No filters needed.',
    imageUrl: 'https://picsum.photos/seed/p2/800/600',
    likes: ['u1'],
    comments: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'p3',
    userId: 'u3',
    content: 'Thinking about the impact of typography on user retention. What are your favorite font pairings?',
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 100000).toISOString(),
  }
];

// --- Simulation Logic ---

// Helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class MockService {
  private users: User[] = [...MOCK_USERS];
  private posts: Post[] = [...MOCK_POSTS];

  async login(username: string): Promise<User | null> {
    await delay(500);
    const user = this.users.find(u => u.username === username);
    return user || null;
  }

  async signup(name: string, username: string): Promise<User> {
    await delay(500);
    const newUser: User = {
      id: `u${Date.now()}`,
      username,
      name,
      bio: 'New to SocialSphere!',
      avatarUrl: `https://picsum.photos/seed/${username}/200/200`,
      followers: [],
      following: [],
      createdAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async getFeed(currentUserId: string): Promise<Post[]> {
    await delay(300);
    const user = this.users.find(u => u.id === currentUserId);
    if (!user) return [];

    // Simple feed algorithm: posts from people I follow + my own posts
    const followingIds = new Set([...user.following, currentUserId]);
    
    const feedPosts = this.posts
      .filter(p => followingIds.has(p.userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Populate user data for UI
    return feedPosts.map(p => ({
      ...p,
      user: this.users.find(u => u.id === p.userId),
      comments: p.comments.map(c => ({
        ...c,
        user: this.users.find(u => u.id === c.userId)
      }))
    }));
  }

  async getAllPosts(): Promise<Post[]> {
    // For "Explore" or general view
    await delay(300);
    return this.posts.map(p => ({
        ...p,
        user: this.users.find(u => u.id === p.userId),
        comments: p.comments.map(c => ({
            ...c,
            user: this.users.find(u => u.id === c.userId)
        }))
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUserProfile(username: string): Promise<{ user: User, posts: Post[] } | null> {
    await delay(300);
    const user = this.users.find(u => u.username === username);
    if (!user) return null;

    const userPosts = this.posts
      .filter(p => p.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(p => ({
        ...p,
        user: user,
        comments: p.comments.map(c => ({
            ...c,
            user: this.users.find(u => u.id === c.userId)
        }))
      }));

    return { user, posts: userPosts };
  }

  async toggleLike(postId: string, userId: string): Promise<void> {
    await delay(100);
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(id => id !== userId);
      } else {
        post.likes.push(userId);
      }
    }
  }

  async addComment(postId: string, userId: string, text: string): Promise<Comment> {
    await delay(200);
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    const newComment: Comment = {
      id: `c${Date.now()}`,
      postId,
      userId,
      text,
      createdAt: new Date().toISOString(),
    };
    post.comments.push(newComment);
    
    // Return with populated user for UI
    return {
        ...newComment,
        user: this.users.find(u => u.id === userId)
    };
  }

  async createPost(userId: string, content: string, imageUrl?: string): Promise<Post> {
    await delay(400);
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId,
      content,
      imageUrl,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    this.posts.unshift(newPost); // Add to beginning
    return newPost;
  }

  async toggleFollow(currentUserId: string, targetUserId: string): Promise<void> {
    await delay(200);
    const currentUser = this.users.find(u => u.id === currentUserId);
    const targetUser = this.users.find(u => u.id === targetUserId);

    if (currentUser && targetUser) {
      if (currentUser.following.includes(targetUserId)) {
        // Unfollow
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
      } else {
        // Follow
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
      }
    }
  }

  async updateUserBio(userId: string, newBio: string): Promise<void> {
    await delay(200);
    const user = this.users.find(u => u.id === userId);
    if (user) {
        user.bio = newBio;
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return this.users.filter(u => 
      u.username.toLowerCase().includes(lowerQuery) || 
      u.name.toLowerCase().includes(lowerQuery)
    );
  }
}

export const mockService = new MockService();