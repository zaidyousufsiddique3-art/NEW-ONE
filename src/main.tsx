import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { LanguageSelectionPage } from './pages/LanguageSelectionPage'
import { KnowledgePage } from './pages/KnowledgePage'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  \u003cReact.StrictMode\u003e
  \u003cLanguageProvider\u003e
  \u003cBrowserRouter\u003e
  \u003cRoutes\u003e
  \u003cRoute path = "/" element = { \u003cLanguageSelectionPage /\u003e} /\u003e
  \u003cRoute path = "/home" element = { \u003cApp /\u003e} /\u003e
  \u003cRoute path = "/knowledge" element = { \u003cKnowledgePage /\u003e} /\u003e
  \u003cRoute path = "*" element = { \u003cNavigate to="/" replace /\u003e} /\u003e
  \u003c / Routes\u003e
  \u003c / BrowserRouter\u003e
  \u003c / LanguageProvider\u003e
  \u003c / React.StrictMode\u003e
)
