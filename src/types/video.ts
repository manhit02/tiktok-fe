export interface Video {
    id: string;
    userId:string;
    videoUrl: string;
    caption: string;
    liked:boolean;
    comments: number;
    views: number;
    createdAt: string;
    avatar:string;
    username:string;
    commentCount:number;
    likeCount:number;
    isLiked:boolean;
}