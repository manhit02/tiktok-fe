import api from "@/lib/axios";
import { Search} from "@/types/search";
import { ApiResponse } from "@/types/apiType";
export const getSearch = (query: string) => {
    return api.get<ApiResponse<Search>>(`/search/${query}`);
};
export const getHistory = () => {
    return api.get(`/search/history`);
};
export const addHistory = (query: string) => {
    return api.post<ApiResponse<Search>>(`/search/history`, { query });
};