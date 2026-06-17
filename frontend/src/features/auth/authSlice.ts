import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { authApi } from '../../api/auth.api'
import type { User, LoginInput, RegisterInput } from '../../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  accessToken: string | null
  hasCheckedAuth: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: null,
  hasCheckedAuth: false,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginInput) => {
    const user = await authApi.login(credentials)
    return user
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterInput) => {
    const user = await authApi.register(userData)
    return user
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout()
})

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const user = await authApi.getMe()
    return user
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null
    }
    return rejectWithValue(error.message || 'Failed to get user')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
        state.hasCheckedAuth = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Login failed'
        state.hasCheckedAuth = true
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.hasCheckedAuth = true
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Registration failed'
        state.hasCheckedAuth = true
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
        state.accessToken = null
        state.hasCheckedAuth = false
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false
        state.hasCheckedAuth = true
        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true
        } else {
          state.user = null
          state.isAuthenticated = false
        }
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false
        state.hasCheckedAuth = true
        state.user = null
        state.isAuthenticated = false
        state.accessToken = null
      })
  },
})

export const { clearError, setUser, setAccessToken } = authSlice.actions
export default authSlice.reducer