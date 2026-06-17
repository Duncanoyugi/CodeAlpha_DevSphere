import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  notificationModalOpen: boolean
  isLoading: boolean
}

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: true,
  notificationModalOpen: false,
  isLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setNotificationModal: (state, action: PayloadAction<boolean>) => {
      state.notificationModalOpen = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { toggleTheme, toggleSidebar, setNotificationModal, setLoading } = uiSlice.actions
export default uiSlice.reducer