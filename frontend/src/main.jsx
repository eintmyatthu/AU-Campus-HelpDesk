import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { TicketsProvider } from './context/TicketsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <TicketsProvider>
          <App />
        </TicketsProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
