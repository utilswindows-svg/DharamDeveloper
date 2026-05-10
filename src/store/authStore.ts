import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// ============================================================
// Axios instance
// ============================================================
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// Types
// ============================================================
export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  role?: 'user' | 'admin';
  avatar?: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

interface SignupPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}
interface LoginPayload { email: string; password: string; }
interface ForgotPayload { email?: string; phone?: string; channel?: 'email' | 'sms'; }
interface VerifyOtpPayload { email?: string; phone?: string; otp: string; channel?: 'email' | 'sms'; }
interface ResetPasswordPayload { email?: string; phone?: string; newPassword: string; channel?: 'email' | 'sms'; }
interface SocialLoginPayload { provider: 'google' | 'facebook'; accessToken: string; }

// ============================================================
// Helpers
// ============================================================
const getErrorMsg = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || 'Request failed';
  }
  return (err as Error)?.message || 'Unknown error';
};

// ============================================================
// Async thunks (all auth API calls)
// ============================================================
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/signup', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err));
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/refresh', { refreshToken });
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err));
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload: ForgotPayload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/forgot-password', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err));
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: VerifyOtpPayload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/verify-otp', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err));
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/reset-password', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err));
    }
  }
);

export const socialLogin = createAsyncThunk(
  'auth/social',
  async (payload: SocialLoginPayload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/social', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMsg(err));
    }
  }
);

// Calls backend to revoke refresh tokens, then clears local auth state.
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_: void, { dispatch }) => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network/auth errors — we still want to clear local state.
    }
    dispatch(logout());
    return true;
  }
);

// ============================================================
// Slice
// ============================================================
const initialState: AuthState = {
  user: (() => {
    try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  })(),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.message = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    const handleAuthFulfilled = (state: AuthState, action: PayloadAction<any>) => {
      state.loading = false;
      const { user, accessToken, refreshToken: rt, message } = action.payload || {};
      if (user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      }
      if (accessToken) {
        state.accessToken = accessToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('isLoggedIn', 'true');
      }
      if (rt) {
        state.refreshToken = rt;
        localStorage.setItem('refreshToken', rt);
      }
      if (message) state.message = message;
    };

    builder
      // signup
      .addCase(signupUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(signupUser.fulfilled, handleAuthFulfilled)
      .addCase(signupUser.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      // login
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, handleAuthFulfilled)
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      // social
      .addCase(socialLogin.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(socialLogin.fulfilled, handleAuthFulfilled)
      .addCase(socialLogin.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      // refresh
      .addCase(refreshToken.fulfilled, handleAuthFulfilled)
      // forgot
      .addCase(forgotPassword.pending, (s) => { s.loading = true; s.error = null; s.message = null; })
      .addCase(forgotPassword.fulfilled, (s, a) => { s.loading = false; s.message = a.payload?.message || 'OTP sent'; })
      .addCase(forgotPassword.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      // verify otp
      .addCase(verifyOtp.pending, (s) => { s.loading = true; s.error = null; s.message = null; })
      .addCase(verifyOtp.fulfilled, (s, a) => { s.loading = false; s.message = a.payload?.message || 'OTP verified'; })
      .addCase(verifyOtp.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      // reset password
      .addCase(resetPassword.pending, (s) => { s.loading = true; s.error = null; s.message = null; })
      .addCase(resetPassword.fulfilled, (s, a) => { s.loading = false; s.message = a.payload?.message || 'Password updated'; })
      .addCase(resetPassword.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { logout, clearAuthError, clearAuthMessage } = authSlice.actions;

// ============================================================
// Store
// ============================================================
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;