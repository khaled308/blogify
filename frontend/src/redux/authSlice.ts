import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../utils/axios";

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string } | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
}

interface LoginResponse {
  username: string;
  email: string;
  image: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<LoginResponse, LoginCredentials>(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const response = await axios.post("/login", credentials);
    return response.data as LoginResponse;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ username: string }>) => {
          state.status = "idle";
          state.isAuthenticated = true;
          state.user = action.payload;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to login";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
