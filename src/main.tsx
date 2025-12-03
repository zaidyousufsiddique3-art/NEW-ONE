import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { StartPage } from './pages/StartPage'
import { KnowledgePage } from './pages/KnowledgePage'
import { ProtectedRoute } from './components/ProtectedRoute'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/home" element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          } />
          <Route path="/knowledge" element={
            <ProtectedRoute>
              <KnowledgePage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
)
