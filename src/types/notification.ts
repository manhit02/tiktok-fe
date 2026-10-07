export interface NotifiUser {
  id: string;
  username: string;
  avatar: string;
}

export interface NotifiVideo {
  id: string;
  videoUrl: string;
}

export interface NotifiComment {
  id: string;
  content: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  senderId?: string;
  content: string;
  type: "follow" | "like" | "comment" | string;
  isRead: boolean;
  createdAt: string;
  sender?: NotifiUser | null;
  user?: NotifiUser | null;
  video?: NotifiVideo | null;
  comment?: NotifiComment | null;
}

export type NotificationRequest = NotificationItem;
