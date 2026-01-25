import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './components/LanguageProvider'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ConfiguratorPage from './pages/ConfiguratorPage'
import ConfirmationPage from './pages/ConfirmationPage'

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/configure" element={<ConfiguratorPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="confirmation" element={<ConfirmationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
