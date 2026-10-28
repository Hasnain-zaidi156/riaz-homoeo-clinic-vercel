import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const Admin = lazy(() => import('./pages/Admin.jsx'))
const isAdmin = /\/admin(\.html)?\/?$/.test(window.location.pathname)

createRoot(document.getElementById('root')).render(
  isAdmin ? <Suspense fallback={null}><Admin /></Suspense> : <App />
)
