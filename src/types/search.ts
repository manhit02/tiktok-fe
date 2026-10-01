import { Video } from "./video";
import { User } from "./auth";
export interface Search {
    videos: Video[];
    users: User[];
}
export interface History {
    query: string;
}
