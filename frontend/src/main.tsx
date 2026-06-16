import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './components/providers/QueryProvider'
import { SocketProvider } from './components/providers/SocketProvider'
import { store } from './app/store'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <BrowserRouter>
          <SocketProvider>
            <App />
          </SocketProvider>
        </BrowserRouter>
      </QueryProvider>
    </Provider>
  </React.StrictMode>
)