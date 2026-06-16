import { createSlice } from '@reduxjs/toolkit'

interface UIState {
  theme: 'light' | 'dark'
  isSidebarOpen: boolean
}

const initialState: UIState = {
  theme: 'light',
  isSidebarOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
  },
})

export const { toggleTheme, toggleSidebar } = uiSlice.actions
export default uiSlice.reducer