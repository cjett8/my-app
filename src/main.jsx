import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'   // <-- Make sure this matches your file name
import 'bootstrap/dist/css/bootstrap.min.css';  // <-- Add this
import './style.css'

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
