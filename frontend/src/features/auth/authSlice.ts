import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { User } from '../../types'
import { authApi } from '../../api/auth.api'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
}

export const getMe = createAsyncThunk('auth/getMe', async () => {
  return await authApi.getMe()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMe.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? null
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer