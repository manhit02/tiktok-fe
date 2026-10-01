export interface Users {
        id: string;
         username: string;
         email: string;
         avatar: string;
         bio?: string;
         followers: number;
        following: number;
        likeCount: number;
}
export interface FollowUser {
   id:string;
  avatar:string;
  username:string;
}
export interface Follow {
 id: string;
  follower: FollowUser;
  following: string;
}
export interface Follow2 {

  follower: boolean;
  following: boolean;
}