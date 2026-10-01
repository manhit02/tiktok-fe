import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/auth";

interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoggedIn: false,
       isLoading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.isLoading = false;
        },

        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
         finishLoading: (state) => {
            state.isLoading = false;
        },
    },
});

export const { setUser, logout,finishLoading } = authSlice.actions;

export default authSlice.reducer;