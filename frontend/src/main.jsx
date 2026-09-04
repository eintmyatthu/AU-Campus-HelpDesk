import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { TicketsProvider } from './context/TicketsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <TicketsProvider>
        <App />
      </TicketsProvider>
    </ThemeProvider>
  </StrictMode>,
)
