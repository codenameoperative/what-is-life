import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { GameProvider } from './contexts/GameContext'
import { NotifyProvider } from './contexts/NotifyContext'

const rootEl = document.getElementById('root') as HTMLElement
createRoot(rootEl).render(
  <NotifyProvider>
    <GameProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </GameProvider>
  </NotifyProvider>
)
