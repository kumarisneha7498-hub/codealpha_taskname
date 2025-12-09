export interface User {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  followers: string[]; // array of user IDs
  following: string[]; // array of user IDs
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: string;
  user?: User; // Populated for UI convenience
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  likes: string[]; // array of user IDs who liked
  comments: Comment[];
  createdAt: string;
  user?: User; // Populated for UI convenience
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
