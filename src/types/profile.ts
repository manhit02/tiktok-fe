interface FollowUser {
  id: string;
  username: string;
  avatar: string;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  createdAt: string;
  totalLikes: number;
  following: FollowUser[];
  followers: FollowUser[];
}

export interface UpdateProfileRequest {
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
}
  