import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { BrowserRouter } from 'react-router-dom'
// import TestFetchComponent from './testComponent.tsx'



ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <BrowserRouter>
      {/* <TestFetchComponent /> */}
      <App />
    </BrowserRouter>
  </ThemeProvider>
)
