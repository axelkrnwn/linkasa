import React from 'react'
import ReactDOM from 'react-dom/client'
import * as ROUTER from 'react-router-dom'
import './assets/index.css'
import App from './App'

// window.location.href = "/login_as_staff"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ROUTER.BrowserRouter>
      <App />
    </ROUTER.BrowserRouter>
)
